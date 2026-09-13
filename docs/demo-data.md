# Demo data

`supabase/seed.sql` creates a repeatable public graph: four research areas, four fictional researchers, four projects and six published publications. `supabase/demo/seed_qwen_context.sql` safely aligns one known demo title with the indexed Qwen corpus while preserving its immutable slug. Every row uses a stable UUID/slug, has `is_demo = true` and is visibly labelled `DEMO DATA`. The seed contains no Auth users, passwords or private submissions.

Use **Artificial Intelligence** to demonstrate one query returning all four entity types. Other useful terms are **Edge AI**, **Sustainable Computing**, **Digital Education** and **Human-Centred Computing**.

Apply only to the linked development project:

```sh
npx supabase db push --linked --include-seed
```

The seed updates only known rows already marked as demo; it does not delete real rows or rewrite publication identity fields. To remove this exact graph, review and run `supabase/demo/cleanup_demo_data.sql`. The cleanup checks both known UUID ranges and `is_demo = true`; it never truncates a table.
