-- Fictional demonstration content only. No Auth accounts or passwords seeded.
insert into public.research_areas(id,name,slug,description,is_demo) values
 ('10000000-0000-4000-8000-000000000001','DEMO DATA — Artificial Intelligence','demo-artificial-intelligence','DEMO DATA — Explore how machine learning can support accessible learning.',true),
 ('10000000-0000-4000-8000-000000000002','DEMO DATA — Data Science','demo-data-science','DEMO DATA — Explore methods for understanding open datasets.',true)
on conflict (id) do nothing;
insert into public.researchers(id,name,slug,bio,position,is_demo) values ('20000000-0000-4000-8000-000000000001','DEMO DATA — Demo Researcher','demo-researcher','DEMO DATA — Fictional researcher used to demonstrate connected discovery.','DEMO DATA — Research fellow',true) on conflict (id) do nothing;
insert into public.projects(id,title,slug,summary,status,is_demo) values ('30000000-0000-4000-8000-000000000001','DEMO DATA — Accessible Learning','demo-accessible-learning','DEMO DATA — A fictional project exploring accessible learning tools.','ongoing',true) on conflict (id) do nothing;
insert into public.publications(id,title,slug,abstract,year,status,is_demo) values ('40000000-0000-4000-8000-000000000001','DEMO DATA — Exploring accessible learning','demo-accessible-learning-publication','DEMO DATA — This fictional publication demonstrates how research outputs connect to people, projects and research areas. It is not an institutional achievement.',2026,'published',true) on conflict (id) do nothing;
insert into public.researcher_research_areas values ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001') on conflict do nothing;
insert into public.researcher_projects values ('20000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001') on conflict do nothing;
insert into public.project_research_areas values ('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001') on conflict do nothing;
insert into public.publication_researchers values ('40000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001') on conflict do nothing;
insert into public.publication_projects values ('40000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001') on conflict do nothing;
