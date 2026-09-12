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

**Current issue:** WEB-5  
**Branch:** `feat/WEB-5-verify-supabase-journey`  
**Status:** Not started / waiting for bootstrap merge

### Latest handoff
- Work completed:
  - v0.1 bootstrap review and integration planning.
- Areas touched:
  - None yet from feature branch.
- Checks:
  - Bootstrap CI verified green before integration.
- Blockers / dependencies:
  - Hosted Supabase project must be configured.
- Next:
  - Verify the real researcher → admin → published-public journey.
  - Then move to WEB-6 connected search.

---

## Rabin Bam — Backend

**Role:** Backend Primary

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
  - Read project docs and wait for agreed first issue.
- Next:
  - Recommended lane: WEB-10 → WEB-11 → WEB-12.

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
