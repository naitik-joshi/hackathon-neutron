# Islington R&D Digital Hub

Build an understandable connected research ecosystem for a four-person, 24-hour hackathon. Discover → Understand → Connect → Participate. Public knowledge never requires login. Every public page needs context, purpose and a next action. Fictional records visibly say DEMO DATA.

## Before coding

Inspect existing patterns and docs/architecture.md. When working in a team feature branch, also read docs/work-division.md and docs/project-status.md before coding. Reuse shared components. DO NOT redesign unrelated code while implementing a feature. Keep tasks small (30–90 minutes); avoid new infrastructure or abstractions without a concrete need.

## Stack and boundaries

Next.js App Router, React, strict TypeScript, Tailwind, Lucide, Supabase Auth/PostgreSQL, @supabase/ssr, Zod, npm. app/ owns routing; features/ owns business logic; components/ owns reusable UI; lib/ owns auth, validation and Supabase utilities; supabase/ owns migrations and seeds; docs/ owns decisions and handoff. Server Components by default. Client Components only for browser interaction. Validate all action input with Zod; database constraints provide defense in depth. Never trust client roles, hidden controls or getSession() for authorization.

## Security

Student: public read only. Researcher: own submissions and permitted edits, never publish. Admin: review and institutional publishing. Read roles from profiles on the server; database RLS and workflow triggers remain authoritative. New users always start as students. Never set roles from user metadata. No service-role key is required. Never commit credentials or .env.local. Never log passwords or tokens. Use server-only for privileged application modules, and publishable keys for normal Supabase access.

## Database

Use hosted Supabase only during the hackathon. Developer workflow: `npm ci` → configure `.env.local` → `npx supabase link --project-ref YOUR_PROJECT_REF` when needed → `npx supabase db push` for coordinated migrations → `npm run dev`. Keep Supabase CLI configuration and migrations. Retain Docker-free PGlite tests; hosted acceptance remains pending until actually verified.

Enable RLS on every new exposed table. Add policies and negative tests with schema changes. SQL migrations are immutable once shared; create a new timestamped migration. Explicitly coordinate migrations before editing. Generate/check database types after schema changes. Document public visibility and foreign-key deletion behavior. Do not use SECURITY DEFINER without a fixed search_path and narrow grants.

## Team / hot files

Each developer owns their assigned area by default. Before modifying another member’s owned files or any shared/hot file, coordinate first. After completing or handing off a meaningful Linear task, update only your own section in docs/project-status.md.

Coordinate before editing package.json, package-lock.json, app/layout.tsx, global CSS/design tokens, proxy.ts, lib/supabase/_, shared database types, or supabase/migrations/_. One owner per shared change. Feature folders/routes are safe parallel areas after ownership agreement. Keep main healthy; small PRs require another developer's review. Escalate blockers after 15 minutes; integrate every two hours. Do not spawn agents unless explicitly requested for the current task.

## After coding

Run npm run lint, npm run typecheck and npm test. Run npm run build for route, dependency, shared component or auth changes. Add meaningful tests for authorization, validation and workflow changes; do not write tests that merely repeat implementation. Document unavailable integration checks honestly. Use real Linear IDs in feat/<issue-id>-short-name, fix/<issue-id>-short-name, chore/<issue-id>-short-name and PR titles '<issue-id>: Description'. Never invent issue IDs. Never force push or rewrite shared history.
