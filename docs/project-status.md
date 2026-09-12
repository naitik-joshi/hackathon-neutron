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
  - Read-only hosted probe confirms connection works; new tables return PGRST205 (migrations not yet available).
  - Hosted migration application, generated hosted-type comparison and WEB-5 acceptance remain pending.
  - Supabase CLI deployment check failed: no access token/login configured. Backend-only commit excludes the existing frontend form edit.
  - Frontend owner must render private review history and wire WEB-13 interest form; WEB-10 edit UI remains pending.
- Next:
  - Apply approved migrations with the database owner, compare generated types, then run signed-in hosted acceptance.
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
  - WEB-14 depends on workflow work; WEB-13 depends on participation backend/project route.
- Next:
  - Start with WEB-9 public project detail pages after context handoff.
  - Then move to dashboard/participation UI as dependencies become ready.
