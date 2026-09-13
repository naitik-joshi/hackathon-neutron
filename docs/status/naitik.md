# Naitik — Final delivery integration

## WEB-30 / WEB-15 — Authenticated UI rescue

**Branch:** `feat/WEB-30-private-ui-final`

**Status:** Implementation complete; Phase 1 browser acceptance blocked by hosted demo-account provisioning and the pending live interest write.

### Completed

- Rebuilt the shared authenticated shell with a sticky desktop role rail, a real mobile disclosure menu, active destinations, public-site return, sign out, and consistent workspace widths and rhythm.
- Redesigned the student account around stored identity, research discovery, project participation, and the signed-in user's real expressions of interest. No application-status lifecycle was invented.
- Preserved the real WEB-14 researcher query layer while prioritizing Needs Your Action, compact workflow counts, recent submissions, honest identity, and existing feedback/edit/resubmit paths.
- Reworked researcher publication list, detail, and form surfaces into a compact submission workflow. The form reserves an honest Phase 2 readiness boundary without implementing preflight.
- Reordered the admin overview around deterministic Needs Attention, followed by compact operational counts, the review queue, and student interests.
- Simplified the admin queue, detail, decision form, and interest inbox while preserving current server actions, required-note validation, authorization, and RLS boundaries.
- Added contextual private loading and error states. Shared styles retain visible focus, reduced-motion support, mobile touch targets, and clearance for the global research assistant.
- Removed inflated private-workspace wording and generated manuscript-style labels. Displayed operational facts remain database-backed.

### Browser acceptance

- Student authentication succeeds and routes to `/account`.
- Researcher authentication succeeds and routes to `/researcher`.
- `/account`, `/researcher`, `/researcher/publications`, and `/researcher/publications/new` were checked at 375px, 768px, 1024px, and 1440px with no horizontal overflow.
- Student requests for `/admin` and `/researcher` redirect to the forbidden route.
- The 375px workspace menu opens from the keyboard, closes with Escape, restores focus to the trigger, and shows the active route.
- The supplied researcher has no hosted publication records, so a real `/researcher/publications/[id]` browser journey remains pending.
- The supplied admin auth user is awaiting email verification and its matching profile role is `student`; `/admin`, `/admin/submissions`, `/admin/submissions/[id]`, and `/admin/interests` remain pending browser acceptance until that account is correctly provisioned.
- One clearly marked DEMO DATA interest message is prepared in the real public project form but has not been submitted or observed in the admin inbox.

### Verification

- `npm run check`: passed.
- `npm test`: passed, 47/47 tests.
- Default `npm run build`: blocked only by the known local Turbopack worker-port sandbox restriction.
- `npm run build -- --webpack`: passed and generated all routes.
- `git diff --check`: passed.
- Hosted Supabase acceptance remains pending for the admin role, the publication-detail journey, and the project-interest round trip.

### Next recommended task

Correct the supplied admin user's email-confirmation state and `profiles.role` through the trusted hosted provisioning process, then finish admin browser QA and submit exactly one marked DEMO DATA interest for inbox verification. Mark Phase 1 complete only after those checks. Phase 2 starts at WEB-31's deterministic, no-migration submission-preflight design.

---

## WEB-29 public UI/UX redesign

**Branch:** `feat/WEB-29-public-experience`

**Status:** Pass 2 implementation and local browser acceptance complete; hosted Supabase write acceptance remains pending.

## Pass 2 completed

- Rebuilt the public research, researcher, project, and publication directories with entity-specific editorial patterns and honest URL-backed search/filter controls.
- Rebuilt all four entity detail routes around real public relationships, breadcrumbs, concise page introductions, specific empty states, and clear next paths.
- Added a reusable database-backed relationship rail that adapts its current entity and links across research areas, researchers, projects, published outputs, and participation.
- Batched directory relationship lookups to avoid per-row relationship queries. Publications remain restricted to published records in public query paths.
- Preserved the real project-interest action and student/guest access states on project detail. No hosted interest record was created during this visual pass.
- Made Events and Opportunities intentional honest states without inventing events, grants, deadlines, or eligibility. Opportunities directs visitors through Projects to Get Involved.
- Added route-shaped loading states, context-preserving error recovery, purposeful empty states, and a branded not-found route.
- Used CSS-only interaction feedback. Motion was intentionally not installed because short transitions and the existing mobile-navigation island cover the required behavior without additional hydration.
- Removed two unused project-detail presentation components after their real functionality was consolidated into the connected detail page.
- Left auth, admin, researcher workspaces, Qwen, migrations, Supabase core utilities, and the database schema unchanged.

## Data and asset integrity

- Public pages display stored fields and real relationship rows only. DEMO DATA remains visible.
- The local `assets/` source files were not published, uploaded, or linked to database records. They are ignored by Git in the current branch. Approved public files can later move to `public/resources/`; managed or record-linked documents should use hosted Supabase Storage after coordinated data-model work.

## Verification

- `npm run check` passed (ESLint, route type generation, and TypeScript).
- `npm test` passed: 41/41 tests.
- Default `npm run build` reached the known agent-environment Turbopack worker-port restriction (`Operation not permitted`) and reported no application error.
- `npm run build -- --webpack` passed and generated every application route.
- `git diff --check` passed.
- Browser QA covered Home → Research → Area → Researcher → Project → Publication → participation, plus direct project filters, publication and researcher journeys, Events, Opportunities, and not-found at 375px, 768px, 1024px, and 1440px.
- Keyboard QA covered the skip link, desktop and mobile navigation, search/filter controls, entity links, relationship navigation, participation boundary, and footer. The mobile menu closes with Escape and restores the trigger state.
- No application console errors were found. Hydration messages observed during QA were caused by installed browser extensions injecting attributes.

## Remaining work

- Verify one real student project-interest write and the wider auth flow against hosted Supabase without changing hosted schema. This remains part of hosted acceptance rather than WEB-29 visual implementation.
- Map each approved IJMR document to a real entity and decide whether it is a stable public resource or a managed Supabase Storage object before publishing it.
- Keep WEB-6 connected search and the future Qwen publication tools separately scoped. The publication layout provides a clean future integration boundary without rendering dead controls.

## Next recommended task

Complete hosted Supabase smoke acceptance, then start WEB-6 from the finished public directory query and command-surface conventions. Do not combine that work with Qwen UI integration or asset-storage schema changes.
