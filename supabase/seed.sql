-- Repeatable fictional demonstration content. No Auth accounts or passwords.
-- Every record is visibly labelled and uses a stable UUID/slug.
insert into public.research_areas (id, name, slug, description, is_demo) values
  ('10000000-0000-4000-8000-000000000001', 'DEMO DATA — Artificial Intelligence', 'demo-artificial-intelligence', 'DEMO DATA — Machine learning and responsible artificial intelligence for practical research.', true),
  ('10000000-0000-4000-8000-000000000002', 'DEMO DATA — Sustainable Computing', 'demo-sustainable-computing', 'DEMO DATA — Resource-aware digital systems and lower-impact computing practices.', true),
  ('10000000-0000-4000-8000-000000000003', 'DEMO DATA — Digital Education', 'demo-digital-education', 'DEMO DATA — Accessible teaching, assessment and learning technologies.', true),
  ('10000000-0000-4000-8000-000000000004', 'DEMO DATA — Human-Centred Computing', 'demo-human-centred-computing', 'DEMO DATA — Inclusive interfaces and technology shaped around human needs.', true)
on conflict (id) do update set
  name = excluded.name, slug = excluded.slug, description = excluded.description
where public.research_areas.is_demo = true;

insert into public.researchers (id, name, slug, bio, position, is_demo) values
  ('20000000-0000-4000-8000-000000000001', 'DEMO DATA — Asha Rana', 'demo-asha-rana', 'DEMO DATA — Fictional researcher exploring responsible artificial intelligence and edge AI for community applications.', 'DEMO DATA — Research fellow', true),
  ('20000000-0000-4000-8000-000000000002', 'DEMO DATA — Nimesh Karki', 'demo-nimesh-karki', 'DEMO DATA — Fictional researcher studying sustainable computing and efficient cloud systems.', 'DEMO DATA — Lecturer', true),
  ('20000000-0000-4000-8000-000000000003', 'DEMO DATA — Samira Thapa', 'demo-samira-thapa', 'DEMO DATA — Fictional researcher investigating accessible digital education and learning analytics.', 'DEMO DATA — Research associate', true),
  ('20000000-0000-4000-8000-000000000004', 'DEMO DATA — Rohan Shrestha', 'demo-rohan-shrestha', 'DEMO DATA — Fictional researcher designing human-centred interfaces for public services.', 'DEMO DATA — Research assistant', true)
on conflict (id) do update set
  name = excluded.name, slug = excluded.slug, bio = excluded.bio, position = excluded.position
where public.researchers.is_demo = true;

insert into public.projects (id, title, slug, summary, status, is_demo) values
  ('30000000-0000-4000-8000-000000000001', 'DEMO DATA — Edge AI Crop Monitoring', 'demo-edge-ai-crop-monitoring', 'DEMO DATA — A fictional project testing lightweight artificial intelligence for local crop observations.', 'ongoing', true),
  ('30000000-0000-4000-8000-000000000002', 'DEMO DATA — Greener Campus Computing', 'demo-greener-campus-computing', 'DEMO DATA — A fictional study of resource-aware computing practices in teaching laboratories.', 'ongoing', true),
  ('30000000-0000-4000-8000-000000000003', 'DEMO DATA — Accessible Learning Pathways', 'demo-accessible-learning-pathways', 'DEMO DATA — A fictional project examining inclusive digital education tools.', 'completed', true),
  ('30000000-0000-4000-8000-000000000004', 'DEMO DATA — Citizen Service Interfaces', 'demo-citizen-service-interfaces', 'DEMO DATA — A fictional human-centred computing project for understandable public forms.', 'proposed', true)
on conflict (id) do update set
  title = excluded.title, slug = excluded.slug, summary = excluded.summary, status = excluded.status
where public.projects.is_demo = true;

insert into public.publications (id, title, slug, abstract, year, status, is_demo) values
  ('40000000-0000-4000-8000-000000000001', 'DEMO DATA — Machine Learning Based Postpartum Depression Risk Prediction: A Case Study on a Bangladeshi Dataset with Transferability Discussions for Nepal', 'demo-lightweight-ai-crop-stress', 'DEMO DATA — This demonstration record connects to an intentionally indexed paper so the grounded assistant context can be shown.', 2026, 'published', true),
  ('40000000-0000-4000-8000-000000000002', 'DEMO DATA — Responsible Artificial Intelligence in Community Research', 'demo-responsible-ai-community-research', 'DEMO DATA — This fictional paper describes transparent review practices for artificial intelligence used in community research.', 2026, 'published', true),
  ('40000000-0000-4000-8000-000000000003', 'DEMO DATA — Measuring Energy Use in Teaching Laboratories', 'demo-energy-use-teaching-labs', 'DEMO DATA — This fictional paper compares practical indicators for sustainable computing in shared teaching laboratories.', 2025, 'published', true),
  ('40000000-0000-4000-8000-000000000004', 'DEMO DATA — Accessible Feedback for Digital Learning', 'demo-accessible-feedback-digital-learning', 'DEMO DATA — This fictional paper explores readable feedback patterns for accessible digital education environments.', 2025, 'published', true),
  ('40000000-0000-4000-8000-000000000005', 'DEMO DATA — Human-Centred Forms for Public Services', 'demo-human-centred-public-forms', 'DEMO DATA — This fictional paper studies plain-language form design and inclusive interaction patterns for public services.', 2024, 'published', true),
  ('40000000-0000-4000-8000-000000000006', 'DEMO DATA — Edge AI and Sustainable Computing Trade-offs', 'demo-edge-ai-sustainable-tradeoffs', 'DEMO DATA — This fictional paper examines accuracy, latency and energy trade-offs for edge artificial intelligence systems.', 2026, 'published', true)
on conflict (id) do update set
  title = excluded.title, abstract = excluded.abstract,
  year = excluded.year, status = excluded.status
where public.publications.is_demo = true;

insert into public.researcher_research_areas (researcher_id, research_area_id) values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002'),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003'),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004')
on conflict do nothing;

insert into public.researcher_projects (researcher_id, project_id) values
  ('20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001'),
  ('20000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002'),
  ('20000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000003'),
  ('20000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000004')
on conflict do nothing;

insert into public.project_research_areas (project_id, research_area_id) values
  ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001'),
  ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002'),
  ('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002'),
  ('30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003'),
  ('30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004')
on conflict do nothing;

insert into public.publication_researchers (publication_id, researcher_id) values
  ('40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001'),
  ('40000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001'),
  ('40000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000002'),
  ('40000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000003'),
  ('40000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000004'),
  ('40000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000001'),
  ('40000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000002')
on conflict do nothing;

insert into public.publication_projects (publication_id, project_id) values
  ('40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001'),
  ('40000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001'),
  ('40000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000002'),
  ('40000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000003'),
  ('40000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000004'),
  ('40000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000001'),
  ('40000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000002')
on conflict do nothing;
