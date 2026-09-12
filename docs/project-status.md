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

**Current issue:** WEB-5 / WEB-10 / WEB-11 integration
**Branch:** `dev`
**Status:** Local integration complete; hosted acceptance pending

### Latest handoff
- Work completed:
  - Audited the merged frontend/backend contracts and removed misleading project-specific claims that were not backed by schema fields.
  - Added student-only registration, account-aware global navigation, responsive researcher/admin workspace navigation, and a role-aware account page.
  - Wired ownership-scoped publication edit/resubmit, private researcher review history, and admin review notes for request-changes/reject/publish decisions.
  - Applied the shared Stitch-inspired editorial UI foundation and a focused homepage pass using only database-backed records.
- Areas touched:
  - `app/auth/`, `app/account/`, `app/researcher/`, `app/admin/`, shared layout/styles/navigation/UI.
  - Publication and submission frontend integration, project data-fidelity fixes, auth validation tests, and handoff docs.
- Checks:
  - `npm run check` passed (ESLint and TypeScript).
  - `npm test` passed: 24/24 tests.
  - Default Turbopack `npm run build` was blocked by this agent sandbox's worker-port restriction; `npm run build -- --webpack` passed and generated all routes.
  - Local production smoke: public homepage/signup rendered from hosted data, signup mismatch feedback was announced, and signed-out researcher/admin routes redirected to sign-in.
- Blockers / dependencies:
  - Hosted migrations `202609120002_review_feedback.sql` and `202609120003_project_interests.sql` remain unapplied, so review-history and interest acceptance cannot pass against hosted Supabase yet.
  - Hosted Auth/cookie/Data API acceptance remains pending; local checks and PGlite tests do not complete WEB-5.
- Next:
  - Coordinate the hosted migration push with Rabin, compare generated types, then run the complete anonymous/student/researcher/admin acceptance matrix in `docs/testing.md`.
  - After WEB-5 evidence is recorded, continue WEB-6 connected search support without taking WEB-7/WEB-8 public page ownership.

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
