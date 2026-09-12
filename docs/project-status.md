# Project Status — Islington R&D Digital Hub

This is the lightweight code-level handoff log for the hackathon.

## How to use this file

Each member owns ONLY their own section below.

After completing, pausing, handing off or materially changing a task, update your section with:
- current Linear issue
- branch
- status
- what changed
- files/areas touched
- checks run
- blockers/dependencies
- next action

Keep entries short. Do not rewrite another member's section.

If simultaneous edits to this single file begin causing merge conflicts, stop editing this file from feature branches and switch to per-member files under `docs/status/`, with Naitik maintaining this file as the integrated summary.

---

## Integrated Snapshot

**Integration owner:** Naitik Joshi

**Current integration branch:** `dev`

**Current foundation:** v0.1 bootstrap

**Known major pending item:** Hosted Supabase end-to-end acceptance (WEB-5)

**Last integrated checkpoint:** _Update after bootstrap is merged into dev._

---

## Naitik Joshi — Backend & Integration

**Role:** Backend & Integration Primary

**Current issue:** WEB-17 / WEB-22 — Research Operations Intelligence
**Branch:** `feat/WEB-17-needs-attention`
**Status:** Local implementation complete; hosted acceptance pending

### Latest handoff
- Work completed:
  - WEB-17: added deterministic stale-review, inactive-changes-requested, and stale-ongoing-project rules with configurable demo thresholds and normalized severity/action results.
  - WEB-17: added a compact admin Needs Attention list with record links and an honest empty state.
  - WEB-22: added exact database-backed counts for published publications, pending/reviewing submissions, projects, changes requested, and records needing attention.
  - Kept the operations API presentation-independent for later WEB-14 dashboard use.
- Areas touched:
  - `features/operations/`, `components/admin/`, `app/admin/page.tsx`.
  - `tests/operations.test.ts`, `docs/research-operations.md`.
- Checks:
  - `npm run check` passed (ESLint and TypeScript).
  - `npm test` passed: 28/28 tests.
  - Default `npm run build` hit the known agent-environment Turbopack worker-port restriction.
  - `npm run build -- --webpack` passed and generated all routes.
- Blockers / dependencies:
  - Hosted Supabase authorization and live-count acceptance were not performed. WEB-17 and WEB-22 remain pending hosted verification.
  - Shared review/interest migrations and WEB-5 acceptance remain separate pending work.
- Next:
  - Review and integrate WEB-17/WEB-22, then verify the admin overview with a hosted admin session after the coordinated migration/WEB-5 work is ready.
  - Safest next backend issue: WEB-23 researcher profile update review-flow design, beginning with a schema/authorization proposal before any migration.

---

## Rabin Bam — Backend

**Role:** Backend Primary

**Current issue:** WEB-11 / WEB-12 — Review feedback and expression-of-interest backend

**Branch:** `rabin`

**Status:** Local backend verified; hosted migrations and frontend integration pending

### Latest handoff
- Work completed:
  - Added private review history and an atomic admin review RPC with reviewer attribution.
  - Added validated student interest submissions, database deduplication, and owner/admin-only reads.
  - Migration and shared-type ownership explicitly approved by the user on 2026-09-12.
  - Added backend handoff contracts and RLS/transaction/validation/deletion tests.
- Areas touched:
  - `features/submissions/`, `features/participation/`, shared database types.
  - Two additive migrations, `tests/backend-workflows.test.ts`, `docs/backend-handoff.md`.
- Checks:
  - `npm run lint` passed.
  - `npm run typecheck` passed.
  - `npm test` passed (17 tests).
  - `npm run build` passed.
- Blockers / dependencies:
  - Read-only hosted dashboard and Data API checks on 2026-09-12 confirm that `publication_reviews`, `project_interests`, and `review_publication` do not exist in the team project yet.
  - Hosted migration application, generated hosted-type comparison and WEB-5 acceptance remain pending.
  - Supabase CLI deployment check failed because no access token/login is configured. Backend-only commit `f2bb051` excludes the existing frontend form edit.
  - Frontend owner must render private review history and wire WEB-13 interest form; WEB-10 edit UI remains pending.
- Next:
  - Naitik/database owner: review the additive migrations and confirm the shared development project is the deployment target.
  - Rabin: run `npx supabase login`, then `npx supabase link --project-ref mgjplkvuldnvbpqmrpgb`.
  - Rabin and Naitik: inspect pending migrations and run `npx supabase db push`; do not paste the SQL manually or modify an already-shared migration.
  - Rabin: verify the hosted schema contains `publication_reviews`, `project_interests`, and `review_publication`, then generate and compare hosted database types.
  - Rabin/Naitik: run signed-in hosted acceptance with student, researcher and admin accounts, including anonymous/wrong-role/other-owner negative cases under WEB-5.
  - Keep WEB-11 and WEB-12 open until deployment and hosted authorization checks pass; frontend integration remains WEB-10/WEB-13/WEB-14 ownership.
  - Use `docs/backend-handoff.md` for frontend integration contracts and privacy behavior.

---

## Sambhav Shrestha — Frontend / Public Discovery

**Role:** Frontend Primary — Public Discovery

**Current issue:** _Assign after context handoff_  
**Branch:** _TBD_  
**Status:** Context handoff

### Latest handoff
- Work completed:
  - None yet.
- Areas touched:
  - None.
- Checks:
  - None.
- Blockers / dependencies:
  - Read project docs and inspect existing public patterns.
- Next:
  - Recommended lane: WEB-7 → WEB-8.

---

## Millind Shakya — Frontend / Dashboards & Participation

**Role:** Frontend Primary — Dashboards & Participation

**Current issue:** WEB-9  
**Branch:** `frontend/MPhase0`  
**Status:** Complete / Ready for Review & Handoff

### Latest handoff
- Work completed:
  - Implemented public project query layer in `features/projects/queries.ts` (`listProjects`, `getProjectBySlug`).
  - Created reusable project UI components: `ProjectCard`, `ProjectFilterBar`, `ProjectLifecycle`, `ProjectTeam`, `ProjectPublications`, and `ProjectStatusBadge`.
  - Implemented public project directory page at `/projects` with real-time status filtering and search.
  - Implemented public project detail page at `/projects/[slug]` with research lifecycle tracker, team sidebar, outputs list, and Get Involved participation callout.
  - Added PostgreSQL/PGlite security and relation tests in `tests/projects.test.ts`.
- Areas touched:
  - `app/(public)/projects/**`
  - `components/projects/**`
  - `features/projects/**`
  - `tests/projects.test.ts`
- Checks:
  - `npm run check` (0 errors, 0 warnings).
  - `npm test` (all 15 tests passing, including new project RLS tests).
  - `npm run build` (Next.js production build succeeded with `/projects` and `/projects/[slug]`).
- Blockers / dependencies:
  - Ready for Sambhav (WEB-7 and WEB-8) to connect research area pages and public researcher profile routes.
- Next:
  - Hand off context to Sambhav for WEB-7 / WEB-8.
  - Coordinate with Rabin on WEB-12 (expression of interest backend) to connect WEB-13 (Get Involved form submission).
