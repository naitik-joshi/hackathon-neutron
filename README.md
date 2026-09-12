# Islington College R&D Digital Hub

v0.1 foundation for the official Islington Hackathon 2026 project. A connected research ecosystem: **Discover → Understand → Connect → Participate**. Public knowledge needs no account. Researchers submit publications; administrators review and publish them. This bootstrap deliberately does not implement the entire roadmap.

## Stack

Next.js 16.3.5 (stable npm release checked during bootstrap), React 19.3, TypeScript, App Router, Tailwind 4, Lucide, Supabase Auth/PostgreSQL, @supabase/ssr, Zod and npm. Server Components by default. Small shadcn-style native UI primitives; no separate backend or ORM. package-lock.json records exact resolved dependencies. Node 22.18+ or newer; CI uses Node 22.

## Clone and run

```sh
git clone https://github.com/naitik-joshi/hackathon-neutron.git
cd hackathon-neutron
git switch bootstrap/v0.1
npm ci
cp .env.example .env.local
```

Fill in these two public connection values from Supabase's Connect dialog (never fabricate them):

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

No service-role key is needed. Never commit .env.local, passwords or tokens. Without values the app renders a setup state and protected routes redirect to sign-in; it does not substitute fictional arrays for database data.

## Hosted Supabase development workflow

Use the team's hosted Supabase **development** project throughout the hackathon. The workflow is `npm ci` → configure `.env.local` → link the hosted project when needed → apply coordinated migrations → `npm run dev`.

When this checkout needs linking, authenticate the CLI with `npx supabase login` if needed, then run:

```sh
npx supabase link --project-ref YOUR_PROJECT_REF
```

Before applying migrations, coordinate with the database owner and confirm the linked project is the intended hosted development project:

```sh
npx supabase db push
npm run dev
```

An already-linked checkout with no pending migrations only needs `npm run dev` after dependency and environment setup. Open http://localhost:3000. Restart after changing environment values. Production builds embed public environment variables, so rebuild when changing projects.

## Migrations and demo seed

Keep `supabase/config.toml` and versioned SQL in `supabase/migrations/`. Linking and pushing migrations do not apply hosted Auth dashboard settings; configure those separately as described below.

Run `supabase/seed.sql` in the hosted development project's SQL editor to seed the visibly marked examples. Seed is idempotent by stable IDs; no passwords or Auth accounts are seeded. After coordinated schema changes regenerate types with `npx supabase gen types typescript --linked > /tmp/database.types.ts`, compare against `lib/supabase/database.types.ts`, and preserve/relocate the application row aliases while replacing the schema contract.

## Authentication and role provisioning

Password sign-in is implemented at `/auth/sign-in`, and public student registration is available at `/auth/sign-up`. Keep email/password signup enabled in the hosted project. If email confirmation is enabled, a new user sees an honest confirmation message and signs in after verifying their address; if Supabase returns a session immediately, the user is sent to `/account`. Password reset and OAuth are not implemented.

Public registration never accepts a role or profile metadata. The Auth insert trigger creates every new profile as `student`, even if a caller attempts to send privileged metadata. Create researcher and admin test users through the trusted hosted Supabase workflow, set secure passwords, and never put credentials in Git.

After creating accounts, use trusted SQL editor access and the **actual copied Auth UUIDs** to provision institutional roles:

```sql
update public.profiles
set role = 'researcher', display_name = 'DEMO DATA — Researcher tester'
where id = 'REPLACE_WITH_RESEARCHER_AUTH_UUID';

update public.profiles
set role = 'admin', display_name = 'DEMO DATA — Admin tester'
where id = 'REPLACE_WITH_ADMIN_AUTH_UUID';
```

An optional student account needs no role update. Verify exactly one intended row changed per statement. An application user cannot promote their own role. A researcher profile is private account data; the researchers directory is a separate admin-curated public identity. See docs/testing.md for the role matrix and demo steps.

## Commands

| Command           | Purpose                                            |
| ----------------- | -------------------------------------------------- |
| npm run dev       | Development server                                 |
| npm run lint      | ESLint                                             |
| npm run typecheck | Generate Next route types and check TypeScript     |
| npm run check     | Lint + typecheck                                   |
| npm test          | Zod tests and actual embedded PostgreSQL/RLS tests |
| npm run build     | Production build                                   |
| npm run start     | Serve production build                             |
| npm run format    | Prettier (coordinate shared files first)           |

## Team workflow

Read AGENTS.md, docs/architecture.md and docs/handoff-v0.1.md before editing. A: integration; B: auth/backend; C: public discovery; D: dashboards. Escalate blockers after 15 minutes and integrate every two hours. Use small reviewed PRs. Coordinate hot files and explicitly coordinate every database migration. Keep main healthy; work on feature branches from the agreed integration branch.

Linear is the primary backlog. See docs/linear-backlog.json and docs/linear-sync.md. After actual IDs exist: `feat/WEB-123-short-name`, `fix/WEB-123-short-name`, `chore/WEB-123-short-name`; PR title `WEB-123: Description`. IDs in this sentence are examples only. No actual team members are assigned by the bootstrap.

## AI Assistance disclosure

AI coding tools are used during this hackathon. **All generated code is subject to team review.** Developers remain responsible for correctness, security, accessibility, institutional accuracy and final acceptance. All invented institutional records must visibly display **DEMO DATA**.

## Scope and verification

The database-backed publication submission/review/publishing implementation, private review feedback, edit/resubmit interface, student signup, and Docker-free PGlite SQL security tests exist. Hosted Supabase Auth/cookie integration still needs the configured project and real test accounts; see the explicit pending checklist in `docs/testing.md`. No claim is made that a hosted end-to-end demo has been run. Advanced search, full participation, events, notifications and AI remain backlog.
