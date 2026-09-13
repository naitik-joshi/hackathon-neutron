-- Idempotent hosted follow-up for an older demo row whose immutable slug is
-- intentionally preserved. This connects one visible DEMO DATA publication
-- to an exact title in the intentionally indexed Qwen corpus.
update public.publications
set
  title = 'DEMO DATA — Machine Learning Based Postpartum Depression Risk Prediction: A Case Study on a Bangladeshi Dataset with Transferability Discussions for Nepal',
  abstract = 'DEMO DATA — This demonstration record connects to an intentionally indexed paper so the grounded assistant context can be shown.'
where id = '40000000-0000-4000-8000-000000000001'
  and is_demo = true;
