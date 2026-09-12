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

**Current issue:** WEB-10 — Add researcher edit and resubmit screens (backend slice)

**Branch:** `dev`

**Status:** Backend complete / frontend handoff

### Latest handoff
- Work completed:
  - Added Zod-validated researcher resubmission behavior.
  - Scoped updates atomically to the signed-in owner and Draft / Changes Requested states.
  - Resubmission sets Submitted, after which further researcher edits are locked.
  - Added action-level mutation tests and a direct RLS wrong-owner test.
- Areas touched:
  - `features/publications/`
  - `lib/validation/publication.ts`
  - Publication validation, mutation and database tests.
- Checks:
  - `npm run lint` passed.
  - `npm run typecheck` passed.
  - `npm test` passed (15 tests).
  - `npm run build` passed.
- Blockers / dependencies:
  - WEB-5 hosted Supabase acceptance remains pending.
  - Frontend owner still needs to connect the edit/resubmit screen to the new server action.
- Next:
  - Hand off the WEB-10 action contract to the dashboard frontend owner.
  - Coordinate a migration with Naitik before starting WEB-11 or WEB-12 schema work.

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
