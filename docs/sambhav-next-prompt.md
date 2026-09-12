# Sambhav next-task prompt

You are Sambhav, the Public Discovery owner for the Islington College R&D Digital Hub. Start with **WEB-7 — Connect research area pages to people and publications**, then move to **WEB-8 — Create public researcher detail pages** after WEB-7 is integrated or explicitly cleared for parallel work.

Before coding:

1. Pull the latest integrated `dev` branch. Create or refresh `feat/WEB-7-area-connections` from that exact state. Use `feat/WEB-8-researcher-pages` for WEB-8; do not combine both issues unless Naitik explicitly asks you to.
2. Read `AGENTS.md`, `docs/architecture.md`, `docs/data-model.md`, `docs/design-system.md`, `docs/decisions.md`, `docs/work-division.md`, `docs/project-status.md`, `docs/roadmap.md`, and `docs/testing.md`.
3. Inspect the current shared system in `app/globals.css`, `components/ui/index.tsx`, `components/shared/`, and `components/projects/`. Reuse current project cards, research cards, page headers, status/demo badges, empty states, and button treatments where their types and purpose fit.
4. If the gitignored `stitch/` references are present in your checkout, use them only for visual guidance: editorial hierarchy, compact metadata, indigo/ruby/teal palette, pale blue surfaces, thin borders, responsive 8:4 layouts, and strong next actions. Do not copy invented statistics, people, claims, fields, journal workflows, or unsupported content.

For WEB-7, work mainly in:

- `app/(public)/research/[slug]/page.tsx`
- `features/research/queries.ts`
- focused reusable additions under `components/research/`
- focused query or rendering tests under `tests/` when behavior warrants them

Build the area page from actual relationship tables. Show the area record, linked public researchers, linked projects, and **published publications only**. Account for both direct researcher-area relationships and publication/project connections without inventing relationships. Keep all ordinary research discovery public. Preserve visible **DEMO DATA** treatment on every fictional record. Add useful loading, empty, error, and not-found behavior. Every page must answer: Where am I? Why should I care? What can I do next?

WEB-7 acceptance criteria:

- `/research/[slug]` shows the requested public research area and database-backed connections to people, projects, and published publications.
- Unpublished publication rows never render and private profile/account data is never queried for public display.
- Linked entity cards lead to useful existing destinations; if WEB-8 is not yet available, avoid knowingly broken researcher links.
- Empty relationship groups explain what is absent and offer a relevant next destination.
- DEMO DATA remains visible, keyboard focus is clear, and 375px/tablet/desktop layouts have no horizontal overflow.

For WEB-8, work mainly in:

- new routes under `app/(public)/researchers/`, especially `app/(public)/researchers/[slug]/page.tsx`
- focused queries in `features/research/` or a small `features/researchers/` module if that boundary is clearer
- reusable researcher cards/details under `components/research/`
- the existing project team/card links only after the route exists and only with a focused change

Use the curated public `researchers` table, never the private `profiles` table, for public identity. Show biography, position, linked research areas, projects, and published publications from actual relationships. Do not infer principal-investigator status, achievements, supervision, availability, metrics, or contact details from record order or missing schema fields.

WEB-8 acceptance criteria:

- `/researchers/[slug]` renders a public researcher identity and database-backed related areas, projects, and published publications.
- Missing slugs return the existing not-found experience.
- Private profiles, account UUIDs, review feedback, and unpublished submissions never render.
- Existing project researcher entries may link to the new page once the route works.
- Empty/error/loading states, DEMO DATA, keyboard access, and responsive layout match the shared system.

Ownership boundaries:

- Do not modify auth, account, researcher workspace, admin, database migrations, `lib/supabase/`, shared database types, `app/layout.tsx`, or global design tokens without coordinating with Naitik first.
- Avoid broad changes to Millind's project architecture. Reuse it and make only the small link integration needed after researcher routes exist.
- Use React Server Components by default. Keep authorization in PostgreSQL/RLS and server code. Do not add hard-coded institutional facts or React-only data substitutes.

Before handoff, run `npm run check`, `npm test`, and `npm run build`. Update only Sambhav's section in `docs/project-status.md` with files touched, exact results, blockers, and next action. Use small commits with the Linear identifier, and commit or push only if Naitik's team workflow authorizes it.
