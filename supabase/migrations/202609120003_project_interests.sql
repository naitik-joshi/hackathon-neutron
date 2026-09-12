-- WEB-12: private student contact context; one expression per project/person.
create table public.project_interests (
 id uuid primary key default gen_random_uuid(),
 project_id uuid not null references public.projects(id) on delete cascade,
 student_id uuid not null references public.profiles(id) on delete cascade,
 contact_email text not null check (length(contact_email) <= 254 and contact_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 message text not null check (length(trim(message)) between 20 and 2000),
 is_demo boolean not null default false,
 created_at timestamptz not null default now(),
 constraint project_interests_project_student_key unique(project_id, student_id)
);
create index project_interests_student_idx on public.project_interests(student_id);
alter table public.project_interests enable row level security;
grant select, insert on public.project_interests to authenticated;
grant select on public.project_interests to anon;
create policy interests_read on public.project_interests for select to authenticated using (
 student_id = (select auth.uid()) or (select public.current_app_role()) = 'admin'
);
create policy interests_insert on public.project_interests for insert to authenticated with check (
 (select public.current_app_role()) = 'student' and student_id = (select auth.uid())
);
