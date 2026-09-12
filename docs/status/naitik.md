# Naitik — WEB-29 public UI/UX redesign

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
