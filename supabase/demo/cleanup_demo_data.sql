-- Remove only the known final-demo graph. Relationship rows cascade.
delete from public.publications
where is_demo = true and id between
  '40000000-0000-4000-8000-000000000001' and
  '40000000-0000-4000-8000-000000000006';

delete from public.projects
where is_demo = true and id between
  '30000000-0000-4000-8000-000000000001' and
  '30000000-0000-4000-8000-000000000004';

delete from public.researchers
where is_demo = true and id between
  '20000000-0000-4000-8000-000000000001' and
  '20000000-0000-4000-8000-000000000004';

delete from public.research_areas
where is_demo = true and id between
  '10000000-0000-4000-8000-000000000001' and
  '10000000-0000-4000-8000-000000000004';
