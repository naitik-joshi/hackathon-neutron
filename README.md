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

```sh
npm run dev
```

Open http://localhost:3000. Restart after changing environment values. Production builds embed public environment variables, so rebuild when changing projects.

## Database setup

Choose a local development stack or an existing hosted **development** project.

Local (requires running Docker and the Supabase CLI downloaded by npx):

```sh
npx supabase start
npx supabase db reset
```

`db reset` resets only the local development database and applies migrations plus supabase/seed.sql. Do not use it on a shared or production database. Copy local URL and publishable key from the CLI/Studio into .env.local. The local API is normally http://127.0.0.1:54321 and Studio http://127.0.0.1:54323; use the actual CLI output. No passwords or Auth accounts are seeded.

Hosted development project:

```sh
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Inspect the target project before applying migrations. Run supabase/seed.sql in that development project's SQL editor to seed the visibly marked examples. Do not run db reset against hosted data. Seed is idempotent by stable IDs. After coordinated schema changes regenerate types with `npx supabase gen types typescript --linked > /tmp/database.types.ts`, compare against lib/supabase/database.types.ts, and preserve/relocate the application row aliases while replacing the schema contract.

## Authentication and role provisioning

Password sign-in is implemented at /auth/sign-in. During the hackathon create confirmed test accounts in Supabase Dashboard → Authentication → Users (local Studio also works). Set your own secure passwords; never put them in Git. No public signup, email-confirmation callback, password-reset or OAuth flow is implemented. Local configuration disables self-service signup and requires confirmed email accounts. For hosted development, disable new user signup in Auth settings, require confirmed emails, and use passwords of at least eight characters.

The Auth insert trigger creates profiles with role student regardless of user metadata. After creating accounts, use trusted SQL editor access and the **actual copied Auth UUIDs**:

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

The database-backed publication submission/review/publishing implementation and local SQL security tests exist. Hosted Supabase Auth/cookie integration still needs the configured project and real test accounts; see the explicit pending checklist in docs/testing.md. No claim is made that a hosted end-to-end demo has been run. Advanced search, full participation, events, notifications and AI remain backlog.
