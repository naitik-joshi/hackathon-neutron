-- v0.1: institutional directory rows are public and admin-curated.
create type public.app_role as enum ('student','researcher','admin');
create type public.publication_status as enum ('draft','submitted','under_review','changes_requested','published','rejected');
create type public.project_status as enum ('proposed','ongoing','completed','archived');
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check (length(display_name) <= 160),
 role public.app_role not null default 'student',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.research_areas (
 id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
 description text not null, is_demo boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.researchers (
 id uuid primary key default gen_random_uuid(), user_id uuid unique references public.profiles(id) on delete set null,
 name text not null, slug text not null unique, bio text not null, position text not null,
 is_demo boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.projects (
 id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique, summary text not null,
 status public.project_status not null default 'proposed', is_demo boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.publications (
 id uuid primary key default gen_random_uuid(), title text not null check (length(trim(title)) between 3 and 240),
 slug text not null unique, abstract text not null check (length(trim(abstract)) between 20 and 12000),
 doi text check (doi is null or (length(doi) <= 200 and doi ~ '^10\.[0-9]{4,9}/[^[:space:]]+$')),
 year integer check (year between 1900 and 2100), submitted_by uuid references public.profiles(id) on delete set null,
 status public.publication_status not null default 'submitted', published_at timestamptz,
 is_demo boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 constraint publication_timestamp check ((status = 'published') = (published_at is not null))
);
create index publications_owner_idx on public.publications(submitted_by);
create index publications_queue_idx on public.publications(status, created_at desc);
create index publications_public_idx on public.publications(published_at desc) where status = 'published';
create table public.researcher_research_areas (researcher_id uuid not null references public.researchers(id) on delete cascade, research_area_id uuid not null references public.research_areas(id) on delete cascade, primary key (researcher_id,research_area_id));
create index researcher_research_areas_reverse_idx on public.researcher_research_areas(research_area_id);
create table public.researcher_projects (researcher_id uuid not null references public.researchers(id) on delete cascade, project_id uuid not null references public.projects(id) on delete cascade, primary key (researcher_id,project_id));
create index researcher_projects_reverse_idx on public.researcher_projects(project_id);
create table public.project_research_areas (project_id uuid not null references public.projects(id) on delete cascade, research_area_id uuid not null references public.research_areas(id) on delete cascade, primary key (project_id,research_area_id));
create index project_research_areas_reverse_idx on public.project_research_areas(research_area_id);
create table public.publication_researchers (publication_id uuid not null references public.publications(id) on delete cascade, researcher_id uuid not null references public.researchers(id) on delete cascade, primary key (publication_id,researcher_id));
create index publication_researchers_reverse_idx on public.publication_researchers(researcher_id);
create table public.publication_projects (publication_id uuid not null references public.publications(id) on delete cascade, project_id uuid not null references public.projects(id) on delete cascade, primary key (publication_id,project_id));
create index publication_projects_reverse_idx on public.publication_projects(project_id);

-- Definer reads only the caller's role; avoids recursive profile policies.
create function public.current_app_role() returns public.app_role language sql stable security definer set search_path = '' as $$
 select role from public.profiles where id = (select auth.uid())
$$;
revoke all on function public.current_app_role() from public;
grant execute on function public.current_app_role() to anon, authenticated;
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.profiles(id, display_name, role) values (new.id, '', 'student');
 return new;
end $$;
revoke all on function public.handle_new_user() from public;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
create function public.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;
create function public.guard_publication() returns trigger language plpgsql set search_path = '' as $$
begin
 if tg_op = 'UPDATE' then
  if new.id <> old.id or new.submitted_by is distinct from old.submitted_by or new.created_at <> old.created_at or new.slug <> old.slug then
   -- Account deletion may detach attribution through the FK action.
   if not (pg_trigger_depth() > 1 and new.submitted_by is null and new.id = old.id and new.slug = old.slug and new.created_at = old.created_at) then
    raise exception 'Publication identity and attribution are immutable';
   end if;
  end if;
 end if;
 if auth.uid() is not null and public.current_app_role() is distinct from 'admin'::public.app_role then
  if public.current_app_role() is distinct from 'researcher'::public.app_role then raise exception 'Researcher role required'; end if;
  if tg_op = 'INSERT' and (new.status not in ('draft','submitted') or new.submitted_by is distinct from auth.uid()) then raise exception 'Invalid submission'; end if;
  if tg_op = 'UPDATE' then
   if old.submitted_by is distinct from auth.uid() or old.status not in ('draft','changes_requested') or new.status not in ('draft','submitted') or new.is_demo is distinct from old.is_demo then raise exception 'Submission cannot be edited'; end if;
  end if;
 end if;
 if tg_op = 'UPDATE' and new.status <> old.status and public.current_app_role() = 'admin' then
  if not ((old.status = 'submitted' and new.status = 'under_review') or
   (old.status = 'under_review' and new.status in ('published','changes_requested','rejected')) or
   (old.status in ('draft','changes_requested') and new.status = 'submitted')) then raise exception 'Invalid review transition'; end if;
 end if;
 if new.status = 'published' then
  if tg_op = 'INSERT' then new.published_at = now();
  elsif old.status <> 'published' then new.published_at = now();
  else new.published_at = old.published_at; end if;
 else new.published_at = null; end if;
 return new;
end $$;
create trigger publication_workflow before insert or update on public.publications for each row execute function public.guard_publication();
create trigger profiles_updated before update on public.profiles for each row execute function public.touch_updated_at();
create trigger research_areas_updated before update on public.research_areas for each row execute function public.touch_updated_at();
create trigger researchers_updated before update on public.researchers for each row execute function public.touch_updated_at();
create trigger projects_updated before update on public.projects for each row execute function public.touch_updated_at();
create trigger publications_updated before update on public.publications for each row execute function public.touch_updated_at();
alter table public.profiles enable row level security;
grant select, insert, update, delete on public.profiles to authenticated;
grant select on public.profiles to anon;
alter table public.research_areas enable row level security;
grant select, insert, update, delete on public.research_areas to authenticated;
grant select on public.research_areas to anon;
alter table public.researchers enable row level security;
grant select, insert, update, delete on public.researchers to authenticated;
grant select on public.researchers to anon;
alter table public.projects enable row level security;
grant select, insert, update, delete on public.projects to authenticated;
grant select on public.projects to anon;
alter table public.publications enable row level security;
grant select, insert, update, delete on public.publications to authenticated;
grant select on public.publications to anon;
alter table public.researcher_research_areas enable row level security;
grant select, insert, update, delete on public.researcher_research_areas to authenticated;
grant select on public.researcher_research_areas to anon;
alter table public.researcher_projects enable row level security;
grant select, insert, update, delete on public.researcher_projects to authenticated;
grant select on public.researcher_projects to anon;
alter table public.project_research_areas enable row level security;
grant select, insert, update, delete on public.project_research_areas to authenticated;
grant select on public.project_research_areas to anon;
alter table public.publication_researchers enable row level security;
grant select, insert, update, delete on public.publication_researchers to authenticated;
grant select on public.publication_researchers to anon;
alter table public.publication_projects enable row level security;
grant select, insert, update, delete on public.publication_projects to authenticated;
grant select on public.publication_projects to anon;
create policy profiles_read on public.profiles for select to authenticated using (id = (select auth.uid()) or (select public.current_app_role()) = 'admin');
create policy profiles_admin on public.profiles for all to authenticated using ((select public.current_app_role()) = 'admin') with check ((select public.current_app_role()) = 'admin');
create policy publications_read on public.publications for select to anon, authenticated using (status = 'published' or submitted_by = (select auth.uid()) or (select public.current_app_role()) = 'admin');
create policy publications_submit on public.publications for insert to authenticated with check ((select public.current_app_role()) = 'researcher' and submitted_by = (select auth.uid()) and status in ('draft','submitted'));
create policy publications_edit on public.publications for update to authenticated using ((select public.current_app_role()) = 'researcher' and submitted_by = (select auth.uid()) and status in ('draft','changes_requested')) with check (submitted_by = (select auth.uid()) and status in ('draft','submitted'));
create policy publications_admin on public.publications for all to authenticated using ((select public.current_app_role()) = 'admin') with check ((select public.current_app_role()) = 'admin');
create policy research_areas_read on public.research_areas for select to anon, authenticated using (true);
create policy research_areas_admin on public.research_areas for all to authenticated using ((select public.current_app_role()) = 'admin') with check ((select public.current_app_role()) = 'admin');
create policy researchers_read on public.researchers for select to anon, authenticated using (true);
create policy researchers_admin on public.researchers for all to authenticated using ((select public.current_app_role()) = 'admin') with check ((select public.current_app_role()) = 'admin');
create policy projects_read on public.projects for select to anon, authenticated using (true);
create policy projects_admin on public.projects for all to authenticated using ((select public.current_app_role()) = 'admin') with check ((select public.current_app_role()) = 'admin');
create policy researcher_research_areas_read on public.researcher_research_areas for select to anon, authenticated using (true);
create policy researcher_research_areas_admin on public.researcher_research_areas for all to authenticated using ((select public.current_app_role()) = 'admin') with check ((select public.current_app_role()) = 'admin');
create policy researcher_projects_read on public.researcher_projects for select to anon, authenticated using (true);
create policy researcher_projects_admin on public.researcher_projects for all to authenticated using ((select public.current_app_role()) = 'admin') with check ((select public.current_app_role()) = 'admin');
create policy project_research_areas_read on public.project_research_areas for select to anon, authenticated using (true);
create policy project_research_areas_admin on public.project_research_areas for all to authenticated using ((select public.current_app_role()) = 'admin') with check ((select public.current_app_role()) = 'admin');
create policy publication_researchers_read on public.publication_researchers for select to anon, authenticated using (exists (select 1 from public.publications p where p.id = publication_id));
create policy publication_researchers_admin on public.publication_researchers for all to authenticated using ((select public.current_app_role()) = 'admin') with check ((select public.current_app_role()) = 'admin');
create policy publication_projects_read on public.publication_projects for select to anon, authenticated using (exists (select 1 from public.publications p where p.id = publication_id));
create policy publication_projects_admin on public.publication_projects for all to authenticated using ((select public.current_app_role()) = 'admin') with check ((select public.current_app_role()) = 'admin');
