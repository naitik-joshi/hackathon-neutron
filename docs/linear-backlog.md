# Linear backlog

Machine-readable source: [linear-backlog.json](linear-backlog.json). Stable local keys map dependencies; actual Linear IDs and branches are in [linear-sync.md](linear-sync.md). Suggested owners are roles only, not assigned people. P0 critical blocker = Urgent; other P0 = High; P1 = Medium; P2 = Low. Each issue is a 30–90 minute slice or explicitly timeboxed spike.

## F01: Verify the hosted Supabase publication journey

Connect a development Supabase project and exercise the full signed-in workflow.

- Priority: P0 / Urgent
- Milestone: Foundation Alive
- Suggested owner: Backend/Auth
- Scope: supabase/, features/auth/, docs/testing.md
- Estimate: 60 minutes
- Dependencies: None
- Suggested branch: `feat/WEB-5-verify-supabase-journey`

Acceptance criteria:

- Apply migration and seed to a development project.
- Create researcher/admin/student accounts through trusted provisioning.
- Capture submit → review → publish → anonymous read and negative role tests.

## D01: Add connected search across research entities

Extend title search to areas, researchers, projects and publications without leaking private rows.

- Priority: P0 / High
- Milestone: Discovery Works
- Suggested owner: Backend/Integration
- Scope: features/research/, supabase/migrations/
- Estimate: 90 minutes
- Dependencies: F01
- Suggested branch: `feat/WEB-6-connected-search`

Acceptance criteria:

- Search returns grouped entity results with useful links.
- RLS prevents private submissions from appearing.
- Empty query, special characters and zero results are tested.

## D02: Connect research area pages to people and publications

Expand the existing area-to-project preview into a connected discovery page.

- Priority: P0 / High
- Milestone: Discovery Works
- Suggested owner: Public UI/UX
- Scope: app/(public)/research/[slug]/, features/research/
- Estimate: 60 minutes
- Dependencies: F01
- Suggested branch: `feat/WEB-7-area-connections`

Acceptance criteria:

- Show linked researchers and published outputs via relationship tables.
- Preserve DEMO DATA and mobile layouts.
- Each entity has a useful next action.

## D03: Create public researcher detail pages

Give a public researcher identity context and connected work.

- Priority: P0 / High
- Milestone: Discovery Works
- Suggested owner: Public UI/UX
- Scope: app/(public)/researchers/, components/research/
- Estimate: 60 minutes
- Dependencies: F01
- Suggested branch: `feat/WEB-8-researcher-pages`

Acceptance criteria:

- Unique slug route shows biography and public projects/publications.
- Private profile data and unpublished outputs remain hidden.
- Missing records and demo labels are handled.

## D04: Create public project detail pages

Explain a project with its areas, people and published outputs.

- Priority: P0 / High
- Milestone: Discovery Works
- Suggested owner: Public UI/UX
- Scope: app/(public)/projects/, features/projects/
- Estimate: 60 minutes
- Dependencies: F01
- Suggested branch: `feat/WEB-9-project-pages`

Acceptance criteria:

- Slug route shows project purpose and lifecycle status.
- Link relevant areas, researchers and published outputs.
- Keyboard and mobile navigation work.

## W01: Add researcher edit and resubmit screens

Expose the existing draft/change-request permissions through a small edit flow.

- Priority: P0 / High
- Milestone: Research Operations Works
- Suggested owner: Backend/Auth
- Scope: features/publications/, app/researcher/publications/
- Estimate: 90 minutes
- Dependencies: F01
- Suggested branch: `feat/WEB-10-resubmit-publication`

Acceptance criteria:

- Only owners can edit Draft or Changes Requested.
- Resubmission changes status to Submitted and locks edits.
- Direct API and action attempts against other states are tested.

## W02: Add review feedback and reviewer attribution

Explain requested changes and rejection with a visible review note.

- Priority: P0 / High
- Milestone: Research Operations Works
- Suggested owner: Dashboard UI/UX
- Scope: features/submissions/, app/admin/, supabase/migrations/
- Estimate: 90 minutes
- Dependencies: F01
- Suggested branch: `feat/WEB-11-review-feedback`

Acceptance criteria:

- Coordinate an additive migration for review note and reviewer.
- Researcher sees the review feedback on their own record.
- Review notes stay private and cannot be changed by researchers.

## P01: Create expression-of-interest database and action

Let authenticated students express interest in one project with private contact context.

- Priority: P0 / High
- Milestone: Participation Works
- Suggested owner: Backend/Auth
- Scope: features/participation/, supabase/migrations/
- Estimate: 90 minutes
- Dependencies: F01
- Suggested branch: `feat/WEB-12-interest-backend`

Acceptance criteria:

- Coordinate minimal interest schema and RLS.
- Validate and deduplicate submissions.
- Only owner and authorized admin can read private interest records.

## P02: Build Get Involved entry and interest form

Provide a clear participation action from project detail.

- Priority: P0 / High
- Milestone: Participation Works
- Suggested owner: Public UI/UX
- Scope: app/(public)/projects/, features/participation/
- Estimate: 60 minutes
- Dependencies: P01, D04
- Suggested branch: `feat/WEB-13-get-involved`

Acceptance criteria:

- Public information remains accessible without login.
- Account required only when submitting interest.
- Show accessible validation, pending and confirmation states.

## W03: Show role-relevant dashboard next actions

Replace generic next steps with counts and actionable status links.

- Priority: P0 / High
- Milestone: Research Operations Works
- Suggested owner: Dashboard UI/UX
- Scope: app/researcher/, app/admin/
- Estimate: 60 minutes
- Dependencies: W01, W02
- Suggested branch: `feat/WEB-14-dashboard-next-actions`

Acceptance criteria:

- Counts reflect the signed-in role and current records.
- Change requests link to editing and feedback.
- Admin queue shows meaningful empty and error states.

## Q01: Audit responsive and keyboard journeys

Make core discovery and dashboard journeys usable on mobile and by keyboard.

- Priority: P0 / High
- Milestone: Demo Ready
- Suggested owner: Public UI/UX
- Scope: components/, app/, docs/testing.md
- Estimate: 60 minutes
- Dependencies: D02, D03, D04, W03
- Suggested branch: `feat/WEB-15-responsive-audit`

Acceptance criteria:

- Check 375px and desktop layouts without horizontal overflow.
- Labels, focus order and feedback are usable without a mouse.
- Capture representative screenshots and fix critical issues.

## Q02: Rehearse and record the demo acceptance journey

Prove the integrated hackathon workflow and prepare a fallback demonstration.

- Priority: P0 / High
- Milestone: Demo Ready
- Suggested owner: Backend/Integration
- Scope: docs/demo-plan.md, docs/handoff-v0.1.md
- Estimate: 60 minutes
- Dependencies: Q01, P02
- Suggested branch: `feat/WEB-16-demo-rehearsal`

Acceptance criteria:

- Run lint, types, tests and production build on frozen main.
- Rehearse anonymous → researcher → admin → anonymous in separate sessions.
- Check all fictional records have DEMO DATA; save backup screenshots.

## O01: Add Needs Attention and freshness queries

Prioritize stale reviews and incomplete research records.

- Priority: P1 / Medium
- Milestone: Research Operations Works
- Suggested owner: Backend/Integration
- Scope: features/submissions/, app/admin/
- Estimate: 60 minutes
- Dependencies: F01
- Suggested branch: `feat/WEB-17-needs-attention`

Acceptance criteria:

- Define a small set of actionable stale/incomplete rules.
- Admin-only results link to affected records.
- No invented analytics or exposed private records.

## O02: Create a minimal event management slice

Model an admin-managed event with optional external registration.

- Priority: P1 / Medium
- Milestone: Research Operations Works
- Suggested owner: Backend/Integration
- Scope: features/events/, supabase/migrations/
- Estimate: 90 minutes
- Dependencies: F01
- Suggested branch: `feat/WEB-18-event-slice`

Acceptance criteria:

- Add coordinated schema, RLS and admin form for title/date/URL.
- Validate external URLs and label outbound registration.
- Public event summary preserves demo labels.

## O03: Create a minimal opportunity management slice

Let admins publish a small opportunity record with an application direction.

- Priority: P1 / Medium
- Milestone: Participation Works
- Suggested owner: Dashboard UI/UX
- Scope: features/opportunities/, supabase/migrations/
- Estimate: 90 minutes
- Dependencies: F01
- Suggested branch: `feat/WEB-19-opportunity-slice`

Acceptance criteria:

- Coordinate schema and admin-only mutations.
- Show public deadline, description and next action.
- Expired opportunities are clearly indicated.

## O04: Prototype grant directory schema and read view

Document and display the minimum information needed for grants.

- Priority: P1 / Medium
- Milestone: Research Operations Works
- Suggested owner: Backend/Integration
- Scope: features/grants/, supabase/migrations/
- Estimate: 90 minutes
- Dependencies: F01
- Suggested branch: `feat/WEB-20-grant-directory`

Acceptance criteria:

- Agree minimal fields before migrating.
- Only admins curate; public records are explicitly public.
- Seed only clearly marked demonstration records.

## O05: Add in-app review notifications

Notify a researcher when a review decision changes.

- Priority: P1 / Medium
- Milestone: Research Operations Works
- Suggested owner: Backend/Auth
- Scope: features/notifications/, supabase/migrations/
- Estimate: 90 minutes
- Dependencies: W02
- Suggested branch: `feat/WEB-21-review-notifications`

Acceptance criteria:

- Owner-only notification reads and mark-read action.
- Generate notifications transactionally or document reliable delivery.
- No email integration required for this slice.

## O06: Add basic admin counts from real records

Replace the analytics shell with a few useful database-derived counts.

- Priority: P1 / Medium
- Milestone: Research Operations Works
- Suggested owner: Dashboard UI/UX
- Scope: app/admin/, features/analytics/
- Estimate: 45 minutes
- Dependencies: F01
- Suggested branch: `feat/WEB-22-admin-counts`

Acceptance criteria:

- Counts show published outputs, pending reviews and projects.
- Admin-only queries are enforced and empty states are honest.
- No fabricated metrics or large chart dependencies.

## O07: Define researcher profile update review flow

Design a reviewed profile change request without direct institutional publishing.

- Priority: P1 / Medium
- Milestone: Research Operations Works
- Suggested owner: Backend/Auth
- Scope: features/researchers/, docs/data-model.md
- Estimate: 90 minutes
- Dependencies: W02
- Suggested branch: `feat/WEB-23-profile-review`

Acceptance criteria:

- Document minimal requested-change schema and transitions.
- Researcher proposes changes; admin decides publication.
- Add permission tests for proposed data access.

## S01: Evaluate semantic search with a public-only dataset

Timebox a feasibility study after the demo-critical paths work.

- Priority: P2 / Low
- Milestone: Discovery Works
- Suggested owner: Backend/Integration
- Scope: docs/decisions.md, features/research/
- Estimate: 60 minutes
- Dependencies: D01, Q02
- Suggested branch: `feat/WEB-24-semantic-search-spike`

Acceptance criteria:

- Compare keyword search against a small public test set.
- Document cost, privacy and infrastructure tradeoffs.
- No production embeddings added without team decision.

## S02: Design a cited public research assistant

Explore a grounded assistant that points back to published evidence.

- Priority: P2 / Low
- Milestone: Discovery Works
- Suggested owner: Public UI/UX
- Scope: docs/product-vision.md, docs/architecture.md
- Estimate: 60 minutes
- Dependencies: Q02
- Suggested branch: `feat/WEB-25-assistant-spike`

Acceptance criteria:

- Specify citations, refusal/unknown behavior and public data boundary.
- Create a small reviewable interaction sketch.
- Record evaluation criteria before choosing an AI SDK.

## S03: Evaluate admin recommendations and personalization

Explore useful recommendations without opaque institutional decisions.

- Priority: P2 / Low
- Milestone: Research Operations Works
- Suggested owner: Dashboard UI/UX
- Scope: docs/decisions.md, app/admin/
- Estimate: 60 minutes
- Dependencies: O01, Q02
- Suggested branch: `feat/WEB-26-recommendations-spike`

Acceptance criteria:

- Identify two actionable suggestions with explanations.
- Document privacy and opt-in requirements for personalization.
- Keep approval and publication human-controlled.

## S04: Scope partners and richer integrations

Plan a partner directory and one useful integration without expanding bootstrap.

- Priority: P2 / Low
- Milestone: Participation Works
- Suggested owner: Backend/Integration
- Scope: docs/data-model.md, docs/roadmap.md
- Estimate: 45 minutes
- Dependencies: Q02
- Suggested branch: `feat/WEB-27-partner-integrations-spike`

Acceptance criteria:

- Document partner relationships and public/private fields.
- Identify one integration with source ownership and failure behavior.
- Break implementation into bounded follow-up issues.
