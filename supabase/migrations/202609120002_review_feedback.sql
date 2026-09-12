-- WEB-11: private review history, separate from publicly readable publications.
create table public.publication_reviews (
 id uuid primary key default gen_random_uuid(),
 publication_id uuid not null references public.publications(id) on delete cascade,
 reviewer_id uuid references public.profiles(id) on delete set null,
 decision public.publication_status not null check (decision in ('under_review','published','changes_requested','rejected')),
 note text not null default '' check (length(note) <= 4000),
 created_at timestamptz not null default now(),
 constraint review_reason_required check (decision not in ('changes_requested','rejected') or length(trim(note)) >= 3)
);
create index publication_reviews_history_idx on public.publication_reviews(publication_id, created_at desc);
alter table public.publication_reviews enable row level security;
grant select, insert on public.publication_reviews to authenticated;
grant select on public.publication_reviews to anon;
create policy reviews_read on public.publication_reviews for select to authenticated using (
 (select public.current_app_role()) = 'admin' or exists (
  select 1 from public.publications p where p.id = publication_id and p.submitted_by = (select auth.uid())
 )
);
create policy reviews_insert on public.publication_reviews for insert to authenticated with check (
 (select public.current_app_role()) = 'admin' and reviewer_id = (select auth.uid())
);

-- Invoker: both the publication update and history insert remain subject to RLS.
create function public.review_publication(p_id uuid, p_decision public.publication_status, p_note text default '')
returns text language plpgsql security invoker set search_path = '' as $$
declare result_slug text;
begin
 if public.current_app_role() is distinct from 'admin'::public.app_role then
  raise exception 'Administrator role required';
 end if;
 if p_decision is null or p_decision not in ('under_review','published','changes_requested','rejected') then
  raise exception 'Invalid review decision';
 end if;
 update public.publications set status = p_decision
 where id = p_id and status = case when p_decision = 'under_review' then 'submitted'::public.publication_status else 'under_review'::public.publication_status end
 returning slug into result_slug;
 if not found then raise exception 'Submission is missing or its status changed'; end if;
 insert into public.publication_reviews(publication_id, reviewer_id, decision, note)
 values (p_id, auth.uid(), p_decision, trim(coalesce(p_note, '')));
 return result_slug;
end $$;
revoke all on function public.review_publication(uuid, public.publication_status, text) from public;
grant execute on function public.review_publication(uuid, public.publication_status, text) to authenticated;
