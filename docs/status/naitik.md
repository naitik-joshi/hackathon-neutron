# Naitik — WEB-14 researcher dashboard handoff

**Branch:** `feat/WEB-14-researcher-dashboard`

**Status:** Local implementation complete; hosted acceptance pending.

## Work completed

- Replaced the fabricated researcher dashboard with authenticated, researcher-scoped publication activity.
- Added exact counts for total, submitted, under-review, changes-requested, published and rejected submissions.
- Added a Needs Your Action section limited to the signed-in researcher's changes-requested records, with feedback and edit/resubmit links.
- Added recent own submissions, real profile identity, an optional linked public researcher profile, and intentional empty, loading and error states.
- Removed unsupported grants, departments, senate membership, compute allocation, project progress, Slurm jobs, ethics codes, fellows, reviewers, deadlines, journal metadata and performance claims.

## Files and boundaries

- Added `features/researcher/`, `components/researcher/dashboard.tsx`, researcher route loading/error UI and focused tests.
- Updated the researcher overview and private publication anchors only.
- No admin, operations, public discovery, Qwen, migration, Supabase utility, shared status or global-style files were changed.
- No IJMR resource download was added because no approved resource is currently exposed through a verified application URL.

## Verification

- `npm run check` passed (ESLint and TypeScript).
- `npm test` passed: 35/35 tests.
- Default `npm run build` hit the known agent-environment Turbopack worker-port restriction.
- `npm run build -- --webpack` passed and generated all application routes.
- Responsive behavior was audited in code for 375px, tablet and desktop breakpoints; authenticated browser acceptance remains pending.
- Hosted Supabase role, count and private-record acceptance remains pending.

## Next

- Review and merge WEB-14, then perform hosted researcher role/ownership acceptance when the shared hosted migrations are available.
- After WEB-14 integration, begin WEB-6 connected search as a separate coordinated branch.
