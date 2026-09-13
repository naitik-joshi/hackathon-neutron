-- Researcher access requests and template-backed publication documents.
alter table public.publications
  add column document_path text,
  add column document_name text,
  add column document_mime_type text,
  add column document_metadata jsonb not null default '{}'::jsonb,
  add constraint publication_document_path_length check (document_path is null or length(document_path) <= 500),
  add constraint publication_document_name_length check (document_name is null or length(document_name) between 1 and 255),
  add constraint publication_document_mime_length check (document_mime_type is null or length(document_mime_type) <= 120),
  add constraint publication_document_metadata_object check (jsonb_typeof(document_metadata) = 'object');

create unique index publications_document_path_key
  on public.publications(document_path)
  where document_path is not null;

create function public.guard_publication_document()
returns trigger language plpgsql set search_path = '' as $$
begin
  if auth.uid() is not null and (
    new.document_path is distinct from old.document_path or
    new.document_name is distinct from old.document_name or
    new.document_mime_type is distinct from old.document_mime_type or
    new.document_metadata is distinct from old.document_metadata
  ) then
    raise exception 'Publication document fields are immutable after submission';
  end if;
  return new;
end $$;

create trigger publication_document_immutable
before update on public.publications
for each row execute function public.guard_publication_document();

create function public.guard_profile_role_change()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null then
    if public.current_app_role() is distinct from 'admin'::public.app_role then
      raise exception 'Administrator role required';
    end if;
    if new.id = auth.uid() then
      raise exception 'Administrators cannot change their own role';
    end if;
  end if;
  return new;
end $$;

create trigger profile_role_change_guard
before update on public.profiles
for each row execute function public.guard_profile_role_change();

create table public.researcher_access_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null check (length(trim(full_name)) between 2 and 160),
  contact_email text not null check (
    length(contact_email) <= 254 and
    contact_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  position text not null check (length(trim(position)) between 2 and 160),
  affiliation text not null check (length(trim(affiliation)) between 2 and 240),
  reason text not null check (length(trim(reason)) between 20 and 2000),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_note text not null default '' check (length(review_note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint researcher_access_review_state check (
    (status = 'pending' and reviewed_by is null and reviewed_at is null) or
    (status in ('approved','rejected') and reviewed_by is not null and reviewed_at is not null)
  )
);

create unique index researcher_access_one_pending_per_user
  on public.researcher_access_requests(user_id)
  where status = 'pending';
create index researcher_access_admin_queue
  on public.researcher_access_requests(status, created_at desc);
create index researcher_access_user_history
  on public.researcher_access_requests(user_id, created_at desc);

create trigger researcher_access_requests_updated
before update on public.researcher_access_requests
for each row execute function public.touch_updated_at();

alter table public.researcher_access_requests enable row level security;
grant select, insert on public.researcher_access_requests to authenticated;

create policy researcher_access_read
on public.researcher_access_requests for select to authenticated
using (
  user_id = (select auth.uid()) or
  (select public.current_app_role()) = 'admin'
);

create policy researcher_access_submit
on public.researcher_access_requests for insert to authenticated
with check (
  user_id = (select auth.uid()) and
  status = 'pending' and
  reviewed_by is null and
  reviewed_at is null and
  (select public.current_app_role()) = 'student'
);

create function public.review_researcher_access_request(
  p_id uuid,
  p_decision text,
  p_note text default ''
)
-- Definer is intentionally narrow: it checks the caller's database role and
-- performs the request decision plus profile promotion as one transaction.
returns uuid language plpgsql security definer set search_path = '' as $$
declare target_user uuid;
begin
  if public.current_app_role() is distinct from 'admin'::public.app_role then
    raise exception 'Administrator role required';
  end if;
  if p_decision is null or p_decision not in ('approved','rejected') then
    raise exception 'Invalid access decision';
  end if;
  if length(trim(coalesce(p_note, ''))) > 2000 then
    raise exception 'Review note is too long';
  end if;

  update public.researcher_access_requests
  set status = p_decision,
      reviewed_by = auth.uid(),
      reviewed_at = now(),
      review_note = trim(coalesce(p_note, ''))
  where id = p_id and status = 'pending'
  returning user_id into target_user;

  if not found then
    raise exception 'Request is missing or has already been reviewed';
  end if;

  if p_decision = 'approved' then
    update public.profiles set role = 'researcher'
    where id = target_user and role = 'student';
    if not found then
      raise exception 'Request account is missing or no longer a student';
    end if;
  end if;

  return target_user;
end $$;

revoke all on function public.review_researcher_access_request(uuid, text, text) from public;
grant execute on function public.review_researcher_access_request(uuid, text, text) to authenticated;

create function public.admin_set_profile_role(p_user_id uuid, p_role public.app_role)
returns public.app_role language plpgsql security invoker set search_path = '' as $$
begin
  if public.current_app_role() is distinct from 'admin'::public.app_role then
    raise exception 'Administrator role required';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'Administrators cannot change their own role';
  end if;

  update public.profiles set role = p_role where id = p_user_id;
  if not found then raise exception 'Account is missing'; end if;
  return p_role;
end $$;

revoke all on function public.admin_set_profile_role(uuid, public.app_role) from public;
grant execute on function public.admin_set_profile_role(uuid, public.app_role) to authenticated;

-- The hosted project already owns the private ResearchFileData bucket. Add
-- object policies only when the Supabase Storage schema is present (PGlite
-- migration tests intentionally do not emulate Storage internals).
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'storage' and table_name = 'objects'
  ) then
    execute $policy$
      create policy research_documents_insert
      on storage.objects for insert to authenticated
      with check (
        bucket_id = 'ResearchFileData' and
        (storage.foldername(name))[1] = (select auth.uid())::text and
        (select public.current_app_role()) = 'researcher'
      )
    $policy$;
    execute $policy$
      create policy research_documents_read
      on storage.objects for select to anon, authenticated
      using (
        bucket_id = 'ResearchFileData' and (
          exists (
            select 1 from public.publications p
            where p.document_path = name and p.status = 'published'
          ) or
          (storage.foldername(name))[1] = (select auth.uid())::text or
          (select public.current_app_role()) = 'admin'
        )
      )
    $policy$;
    execute $policy$
      create policy research_documents_cleanup
      on storage.objects for delete to authenticated
      using (
        bucket_id = 'ResearchFileData' and
        (storage.foldername(name))[1] = (select auth.uid())::text and
        not exists (
          select 1 from public.publications p where p.document_path = name
        )
      )
    $policy$;
  end if;
end $$;
