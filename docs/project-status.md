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

**Current issue:** Public-site integration audit (user reassigned to Rabin); WEB-11 / WEB-12 hosted follow-up

**Branch:** `rabin-01`

**Status:** Public code audit and local checks complete; browser/hosted acceptance pending

### Latest handoff
- Public-site audit (2026-09-12, carried out by Rabin):
  - Inspected all 11 public route patterns against current `dev` baseline `e05a583`; repaired slug links, real area connections, published-only detail/metadata, honest search filters and account-aware navigation.
  - Removed unsupported metrics, journal/indexing claims, fabricated project details and placeholder events/opportunities. Preserved visible DEMO DATA and shared components.
  - Touched public routes, public navigation/footer/cards, narrow root layout copy, research query/filter helpers and focused tests. No AI, admin/dashboard, migrations, environment or credentials changed.
  - `npm run check` passed; `npm test` passed (28/28); default `npm run build` passed. Full responsive/browser and live hosted role-matrix checks were not run in this time-boxed pass.
  - Full findings and next ownership actions: `docs/public-site-audit.md`. No push, merge, Linear mutation or hosted migration performed.
  - Next: Naitik/Sambhav review and verify 375px/tablet/desktop; Millind wire WEB-13 interest UI; Rabin/Naitik coordinate hosted backend acceptance below. WEB-6 unified search remains separate.
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

**Current issue:** WEB-7 / WEB-8
**Branch:** `feat/WEB-7-area-connections` / `feat/WEB-8-researcher-pages`
**Status:** Completed WEB-7 and WEB-8. Ready for review/integration.

### Latest handoff
- Work completed:
  - Added area relationship queries to fetch projects, researchers, and published publications.
  - Connected `/research/[slug]` page to real data.
  - Created `ResearcherCard` component and reused existing components.
  - Implemented public researcher profile routes `/researchers/[slug]`.
  - Linked `ProjectTeam` component to public researcher profiles.
- Areas touched:
  - `app/(public)/research/[slug]/page.tsx`
  - `app/(public)/researchers/[slug]/page.tsx`
  - `features/research/queries.ts`
  - `components/research/researcher-card.tsx`
  - `components/projects/project-team.tsx`
- Checks:
  - `npm run check` passed on both branches.
- Blockers / dependencies:
  - Ready for Naitik to review and integrate into `dev`.
- Next:
  - Help with public discovery polish after WEB-7 and WEB-8 are integrated.

---

## Millind Shakya — Frontend / Dashboards & Participation

**Role:** Frontend Primary — Dashboards & Participation

**Current issue:** WEB-14 — Admin Editorial Panel & Research Operations  
**Branch:** `admin/sprint`  
**Status:** Complete / Ready for Review & Integration

### Latest handoff
- Work completed:
  - Phase 1: Real database-backed admin dashboard overview (`/admin`) computing live operational KPIs (triage, peer review, revisions, published records, student interest count) and displaying real submissions requiring editorial action.
  - Phase 2: Manuscript review queue (`/admin/submissions`) with real-time status filter tabs (`Active Queue`, `Awaiting Triage`, `Under Review`, `Revisions`, `Published`, `All Records`), title/abstract search, and submitter profile resolution.
  - Phase 3: State-aware submission review dossier (`/admin/submissions/[id]`) integrating submitter profile, co-authors, affiliated projects, private review history (`getPublicationReviews`), and formal editorial review actions (`under_review`, `published`, `changes_requested`, `rejected`).
  - Phase 4: Student participation & project interest inbox (`/admin/interests`) integrating `getInterestInbox()` with enriched project and student profile metadata.
  - Phase 5: Responsive and accessibility validation across desktop, tablet, and 375px mobile widths, ensuring semantic headings, accessible forms, and clear `DEMO DATA` labeling.
- Areas touched:
  - `app/admin/layout.tsx`
  - `app/admin/page.tsx`
  - `app/admin/submissions/page.tsx`
  - `app/admin/submissions/[id]/page.tsx`
  - `app/admin/interests/page.tsx`
  - `features/submissions/admin-queries.ts`
  - `features/submissions/review-form.tsx`
  - `features/participation/queries.ts`
- Checks:
  - `npm run lint` passed (0 errors, 0 warnings).
  - `npm run typecheck` passed.
  - `npm test` passed (24/24 tests passing).
  - `npm run build` passed (Next.js production build succeeded with all admin routes).
- Blockers / dependencies:
  - Ready for Naitik to review and integrate into `dev`.
  - Local PGlite and backend tests verified; hosted Supabase acceptance pending deployment of migrations `202609120002_review_feedback.sql` and `202609120003_project_interests.sql`.
- Next:
  - Coordinate branch review and integration into `dev`.
