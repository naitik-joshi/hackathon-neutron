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

**Current issue:** WEB-17 / WEB-22 integration, with WEB-14 next
**Branch:** `feat/WEB-17-needs-attention`
**Status:** Local implementation and current admin UI integration complete; hosted acceptance pending

### Latest handoff

- Work completed:
  - WEB-17: added deterministic stale-review, inactive-changes-requested, and stale-ongoing-project rules with configurable demo thresholds and normalized severity/action results.
  - Configured 7-day stale-review, 14-day changes-requested, and 60-day stale-ongoing-project demonstration thresholds; these are not institutional policy.
  - WEB-17: added a compact admin Needs Attention list with record links and an honest empty state.
  - WEB-22: added exact database-backed counts for published publications, pending/reviewing submissions, projects, changes requested, and records needing attention.
  - Integrated the attention engine into Millind's latest database-backed admin dashboard without replacing its KPIs, review queue, recent submissions, or interest inbox.
  - Kept the operations API presentation-independent for later WEB-14 dashboard use.
- Areas touched:
  - `features/operations/`, `components/admin/`, `app/admin/page.tsx`.
  - `tests/operations.test.ts`, `docs/research-operations.md`.
- Checks:
  - `npm run check` passed (ESLint and TypeScript).
  - `npm test` passed: 32/32 tests.
  - Default `npm run build` hit the known agent-environment Turbopack worker-port restriction.
  - `npm run build -- --webpack` passed and generated all routes.
- Blockers / dependencies:
  - Hosted Supabase authorization and live-count acceptance were not performed. WEB-17 and WEB-22 remain pending hosted verification.
  - Shared review/interest migrations and WEB-5 acceptance remain separate pending work.
- Next:
  - Complete WEB-14 integration review, then verify the admin overview with a hosted admin session after the coordinated migration/WEB-5 work is ready.

---

## Rabin Bam — Backend

**Role:** Backend Primary

**Current issue:** WEB-16 release hardening with WEB-6, WEB-30 and WEB-32 acceptance

**Branch:** `feat/WEB-16-final-release-hardening`

**Status:** Public search, demo data and live Qwen contracts pass; authenticated/browser acceptance remains blocked

### Latest handoff

- Final release hardening (2026-09-13):
  - Added public `/search` with bounded deterministic ranking across areas, researchers, projects and published publications; private workflow states are excluded in both queries and ranking tests. Homepage and primary navigation now link to it.
  - Applied a repeatable hosted graph of four areas, four fictional researchers, four projects and six publications. All are visibly `DEMO DATA`; cleanup targets only known demo UUIDs.
  - Added student/researcher signup intent without role elevation, reused extracted references in Submission Readiness, and added protected Supabase Auth administrator invitation/promotion with explicit confirmation and a server-only optional service key.
  - Fixed Qwen ready/index state contradictions and deployed PDF article-title extraction to AWS. Live same-origin health, papers, positive query, exact hard-negative, recommendation and positive compare passed; EC2 and Ollama are active.
  - Checks passed: lint, TypeScript, 72/72 application tests, 7/7 Qwen API tests, hosted seed application and public search smoke. Production build and final diff/secret checks are next.
  - Blockers: no disposable hosted role credentials, no configured admin-invite service key, browser-control transport unavailable, and Qwen transport remains plain HTTP.

- PDF runtime repair (2026-09-13): externalized server-only PDF.js so its worker resolves correctly under Next.js/Turbopack, replaced the generic error with explicit no-text/malformed/limit states, added IJMR journal-layout title/section extraction and kept every detected PDF field editable. The exact `IJRM_Pant1.pdf` from the reported failure passed the Next.js development route with 62,093 extracted characters. No OCR was added.
- Researcher access and article intake (2026-09-13):
  - Added student-owned researcher access requests, an admin review queue, atomic database-backed approval/promotion, and guarded role management for existing self-registered accounts. New accounts still always start as students; the app never creates or exposes credentials.
  - Added upload-first publication intake using the supplied institutional template for DOCX and text-based PDF: authenticated researcher-only extraction, editable optional fields, server re-validation, private `ResearchFileData` upload, and publication/document metadata insertion with cleanup on failure. Image-only PDFs are rejected without OCR.
  - Added migration `202609130001_researcher_access_document_intake.sql`, Storage policies, shared database types, focused parser/validation/PostgreSQL RLS tests, admin/account wiring, and updated data-model documentation. No Qwen, search, or public publication-page redesign was included.
  - Checks passed: `npm run lint`, `npm run typecheck`, `npm test` (64/64), and `npm run build`; the supplied blank template was correctly rejected as an uncompleted article, PDF text extraction was verified against an existing research PDF, and malformed/scanned PDF states were covered.
  - Hosted acceptance: PR #20 merged into `dev` at `67b5fcd`; migration `202609130001` was applied and confirmed in hosted migration history. Anonymous zero-item listing and public-object HEAD probes were denied, anonymous access-request reads exposed no rows, and published metadata remained publicly readable. Complete one real admin-approved demo researcher request plus authenticated owner/other-researcher/admin storage checks and DOCX/PDF submissions before marking WEB-32 Done.
- WEB-30 integration (2026-09-13):
  - Added server-only Qwen configuration/client/error handling, strict Zod request contracts, bounded bodies, timeouts, no-store responses and best-effort per-route rate limits behind five same-origin Next.js handlers.
  - Added one global public Research Paper Assistant with ephemeral grounded conversation, source paper/section presentation, exact-title publication context matching, deterministic recommendations, compare mode, keyboard/Escape support and offline recovery.
  - Added **Analyze this paper** to public publication detail; it opens the same assistant and auto-selects only an exact normalized indexed title.
  - Added a shared responsive researcher/admin workspace shell and removed unsupported policy/licensing/editorial claims from admin copy without changing workflow logic or database schema.
  - Touched `lib/qwen/`, `app/api/research-assistant/`, `components/assistant/`, workspace navigation/layout styles, public publication detail, private workspace presentation/copy, `.env.example`, focused tests and integration documentation.
  - `npm run lint`, `npm run typecheck`, `npm test` (47/47), `npm run build` and `git diff --check` passed. Anonymous desktop/mobile assistant and unavailable-state behavior were browser-checked; no horizontal overflow at 375/768/1024/1440.
  - Live same-origin checks passed for papers, query and recommend. Direct EC2 verification passed compare; the Next.js compare request exceeded its former 120-second timeout, so the proxy timeout is now 165 seconds while remaining below the backend's 180-second limit. A final live compare-proxy recheck remains.
  - Hosted Supabase acceptance (2026-09-13): the remote schema already contained all three migrations, 12 tables and the `review_publication` RPC; generated hosted types matched the checked-in contract. The supplied authenticated/anonymous RLS and workflow matrix passed 26/26, and all five public routes returned 200 without login. No migration or shared type change was required.
- Qwen grounded-paper backend (2026-09-12):
  - Fixed and deployed the authenticated API contract for papers, grounded query, comparison and deterministic related-paper recommendation; eight papers are indexed on the active EC2 service.
  - Rotated the newly disclosed API key again without logging it, moved systemd to an environment file, disabled browser credential entry/wildcard CORS, added input limits and structured offline/error states, and hardened the service sandbox. No main-site UI was changed.
  - Live verification passed for all four required endpoints and the exact absent-claim fallback. Local focused suite passed 10/10; EC2 contract suite passed 6/6; real EC2 parser/watcher/Qwen suite passed 7/7.
  - Contract and deployment evidence: `qwen-grounded-paper-system/FRONTEND_CONNECT_GUIDE.md` and `qwen-grounded-paper-system/DEPLOYMENT_STATUS.md`.
  - Remaining blocker: the EC2 endpoint is plain HTTP. Add trusted TLS/private networking and restrict direct port 8000 before production/Vercel integration. Frontend owner retains all Next.js route/UI placement and Supabase-user authorization work.
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
  - Qwen still uses plain HTTP on public port 8000. Trusted HTTPS and security-group restriction require explicit approval for the AWS network change.
  - Re-run compare through the Next.js proxy after the timeout adjustment; the direct EC2 compare contract already passes.
  - Frontend owner still owns any remaining WEB-10/WEB-13 presentation wiring.
- Next:
  - Complete Qwen HTTPS termination, close public port 8000, update the server-only backend URL and run the final five-route same-origin smoke test.
  - Use `docs/backend-handoff.md` for the verified workflow/privacy contracts.

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

**Current issue:** WEB-13 — Build Get Involved entry and interest form  
**Branch:** `feat/WEB-13-get-involved`  
**Status:** Frontend Complete / Ready for Naitik Backend Integration

### Latest handoff

- Work completed:
  - Phase 1: Integrated "Get Involved" entry CTA in the project detail header and added `ProjectParticipationCallout` sidebar card linking smoothly to `#get-involved`.
  - Phase 2: Implemented accessible, responsive `InterestForm` (`features/participation/interest-form.tsx`) with contact email, statement of interest textarea, real-time character counter (20–2000 chars), and WCAG semantic markup.
  - Phase 3: Built all required UI states: `idle`, `validation error`, `submitting/pending` with spinner, `success confirmation` card, `error` alert, `authentication required` gateway with return redirects, and `already submitted` status notice. Added client validation unit tests in `tests/interest-form.test.ts`.
  - Phase 4: Validated responsive behavior across desktop, tablet, and 375px mobile viewports; verified touch target sizing, focus rings, keyboard navigation, and aria-describedby associations.
- Areas touched:
  - `app/(public)/projects/[slug]/page.tsx`
  - `components/projects/project-participation-callout.tsx`
  - `features/participation/interest-form.tsx`
  - `features/participation/validation.ts`
  - `tests/interest-form.test.ts`
- Checks:
  - `npm run lint` passed (0 errors, 0 warnings).
  - `npm run typecheck` passed (0 errors).
  - `npm test` passed (33/33 tests passing).
  - `npm run build` passed (all Next.js routes built cleanly).
- Blockers / dependencies:
  - Ready for Naitik to connect `expressInterest` server action (`features/participation/actions.ts`) to `InterestForm.onSubmitAction` and wire student session verification.
- Next:
  - Provide Naitik with integration handoff notes for final backend wiring into `dev`.
