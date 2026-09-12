# WEB-29 UI/UX implementation plan

This plan follows the public/auth audit in `docs/ui-ux-audit.md`. Pass 1 now implements Phases A–C; later route work remains planned.

## Pass 1 implementation note

- The tracked root `logo.svg` is the approved source used for this pass. A visually unchanged public copy, normalized only for trailing whitespace, lives at `public/brand/ijmr-logo.svg` so Next.js can serve it without a custom asset pipeline.
- `next/font/google` was evaluated for the planned Source Serif 4 and Inter pairing, but the build environment cannot fetch Google font files. Pass 1 therefore uses stable system serif and sans stacks with the same hierarchy and metrics. Approved self-hosted font files can replace these stacks later without changing component APIs.
- The project-interest form now calls the existing server action. When an action is unavailable it reports that the request was not saved; it never simulates success.
- Homepage data sources settle independently, so one failed query no longer removes every discovery section.

## 1. Final design direction

Build an **academic research index with an editorial journal layer**:

- IJMR/Islington establishes provenance through an approved mark, disciplined ink/navy, teal actions, and publication-style typography.
- The R&D Digital Hub establishes its own purpose through connected entity navigation and participation paths.
- Directories scan like indexes. Detail pages read like dossiers. Publications receive the strongest editorial treatment. Participation becomes one honest conversion moment.
- The signature element is a data-driven **relationship rail**: the current entity sits in a visible path to actual people, projects, publications, and participation. On mobile it becomes an ordered horizontal/stacked trail.
- Restraint comes from rules, type, alignment, and selective surface color. Bordered cards are reserved for bounded actions or truly clickable entities.

The deliberate risk is the relationship rail. It makes graph-like connected data legible without drawing a decorative graph, introducing fake metrics, or adding a visualization dependency.

## 2. Proposed brand tokens

The final values must be checked against the approved IJMR source asset before implementation. The spectrum values below are measured from the supplied, currently untracked `logo.svg`; they are candidate brand accents, not a claim that this file is approved.

```css
:root {
  /* Core */
  --color-ink: #152238;
  --color-ink-soft: #2f3344;
  --color-navy: #0b1c30;
  --color-teal: #0f766e;
  --color-ruby: #9e1b32;

  /* Neutral surfaces */
  --color-canvas: #f7f9fc;
  --color-surface: #ffffff;
  --color-surface-muted: #eef3f7;
  --color-text: #152238;
  --color-text-muted: #5d6878;
  --color-border: #dce3eb;
  --color-border-strong: #b9c4d0;

  /* Semantic */
  --color-success: #0f766e;
  --color-warning: #9a6700;
  --color-danger: #a12235;
  --color-info: #245b8a;

  /* Logo-only / rare taxonomy accents, pending approval */
  --brand-spectrum-yellow: #ffc609;
  --brand-spectrum-red: #ee4554;
  --brand-spectrum-green: #7cc142;
  --brand-spectrum-teal: #00b5a2;
  --brand-spectrum-blue: #0076bb;
}
```

Usage rules:

- Navy/ink carries structure and text. Teal is the default action/accent. Ruby marks consequential or editorial emphasis, not routine decoration.
- The five spectrum colors belong primarily to the approved logo/relationship motif. Do not turn every entity into a rainbow category.
- Text on dark surfaces inherits an explicit `--color-text-on-dark`; base heading rules must use `inherit` so component context wins.
- Add semantic state pairs for background, border, and text rather than placing raw hex values in components.

Other foundational tokens:

```css
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
--shadow-rest: 0 1px 2px rgb(11 28 48 / 0.05);
--shadow-raised: 0 12px 32px -16px rgb(11 28 48 / 0.28);
--container-wide: 80rem;
--container-reading: 48.75rem;
--section-space: clamp(3rem, 7vw, 6.5rem);
--content-gap: clamp(1rem, 2vw, 2rem);
--motion-fast: 140ms;
--motion-base: 220ms;
--ease-standard: cubic-bezier(0.2, 0, 0, 1);
```

Use an 8px spacing family for layout (`0.5, 1, 1.5, 2, 3, 4, 6rem`) with 4px increments only inside controls/metadata.

## 3. Proposed type scale

Retain the intended Source Serif 4 + Inter pairing because it matches the official serif/sans direction and avoids an unnecessary third visual system. Change delivery from runtime CSS `@import` to `next/font` or approved self-hosted files after confirming build availability. Keep system fallbacks.

| Role           | Face                          | Size/line height                       | Use                                                              |
| -------------- | ----------------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| Display        | Source Serif 4, 650–700       | `clamp(2.5rem, 6vw, 5rem)` / 0.98–1.06 | Homepage thesis only; max 12–14 words                            |
| H1             | Source Serif 4, 650           | `clamp(2.1rem, 4vw, 3.75rem)` / 1.08   | One route/entity title                                           |
| H2             | Source Serif 4, 620           | `clamp(1.6rem, 2.6vw, 2.4rem)` / 1.15  | Major sections                                                   |
| H3             | Source Serif 4, 600           | `1.25–1.5rem` / 1.25                   | Entity/card headings                                             |
| Editorial body | Source Serif 4, 400           | `1.1–1.2rem` / 1.7–1.8                 | Abstracts and long biography/summary text only                   |
| UI/body        | Inter, 400–600                | `1rem` / 1.55–1.65                     | Navigation, controls, explanatory copy                           |
| Metadata       | Inter, 500                    | `0.8125–0.875rem` / 1.4                | Dates, roles, relationship counts                                |
| Label          | Inter, 650                    | `0.75–0.8125rem` / 1.25                | Form labels and short taxonomy markers; sentence case by default |
| Button         | Inter, 650                    | `0.875rem` / 1                         | Verb-led controls                                                |
| Mono           | JetBrains Mono or system mono | `0.75rem` / 1.4                        | DOI/technical identifiers only; remove from generic labels       |

Cap readable prose around 65–72 characters. Avoid all-caps eyebrows except short journal/taxonomy markers. Long research titles must wrap naturally without forced truncation on detail pages.

## 4. Proposed component system

Build components only where they enforce recurring behavior:

- `BrandLogo`: approved light/dark/mark variants with fixed proportions and accessible product label.
- `SiteHeader` + small `PrimaryNav` client island + `MobileNav`: active state, role-aware account controls, keyboard/Escape/focus behavior.
- `SiteFooter`: product/journal relationship, internal discovery, verified official resource links.
- `PageIntro`: breadcrumb/context + route-specific H1 and optional controls; replaces one-size-fits-all hero headers.
- `SectionHeader`: title, concise context, and one specific action.
- `SearchCommand`: shared visual grammar for current URL-backed searches; scope copy must match actual backend capability.
- `FilterBar`: selected state, reset, result count, responsive wrapping.
- Typed entity primitives: `ResearchAreaCard`, `ResearcherCard`, `ProjectCard`, `PublicationRow/Card`. Share metadata subcomponents, not one universal card.
- `EntityMeta`, `MetadataRow`, `DemoBadge`, and existing status badges.
- `RelationshipRail`: receives real links/counts; renders empty branches honestly.
- `Breadcrumbs`: route orientation and structured hierarchy.
- `AuthLayout`, `RoleAccessInfo`, `PasswordField`, `FormMessage`.
- `StateFrame`, `EmptyState`, `ErrorState`, and route skeleton patterns.
- `CTASection`: one participation or next-step close per route.
- Optional later `SectionReveal` client island only after Motion decision.

Consolidate link-buttons and buttons through `components/ui/index.tsx` or small files under `components/ui/`; remove the parallel `.btn-academic-*` API once call sites migrate.

## 5. Exact route redesign plan

| Route                  | Planned composition                                                                                                                                                  | Data/behavior constraint                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `/`                    | Branded editorial hero + honest scoped search; one featured real area with relationship preview; compact project/publication editorial rows; one participation close | Independent section failures; no fake totals; search label matches scope |
| `/research`            | Taxonomy intro; search; area hub results with real relationship availability/counts if queried                                                                       | Counts must be database-derived and public                               |
| `/research/[slug]`     | Breadcrumb; area identity; relationship rail; people/projects/publications sections with useful empty branches                                                       | Only public/published relations                                          |
| `/researchers`         | Directory intro; search; identity-led cards/rows with initials                                                                                                       | No images/contact/achievements without approved fields                   |
| `/researchers/[slug]`  | Profile masthead; stored bio/position/areas; projects and published outputs rail                                                                                     | No inferred title or private profile data                                |
| `/projects`            | Compact query/filter command; result context; status-aware project cards/rows                                                                                        | One maintained filter implementation                                     |
| `/projects/[slug]`     | Breadcrumb and real status; editorial summary; team/area/output rail; real participation handoff                                                                     | Wire `expressInterest`; remove simulated success and unsupported claims  |
| `/publications`        | IJMR-influenced publication index; query; title/author/year/context rows                                                                                             | Public `published` records only                                          |
| `/publications/[slug]` | Publication masthead; manuscript abstract; real metadata rail; authors/area/project; related route links                                                             | Future AI boundary described in architecture, no dead UI                 |
| `/events`              | Intentional empty state with route back to research; secondary navigation                                                                                            | No invented records                                                      |
| `/opportunities`       | Intentional empty state pointing to current project participation; secondary navigation                                                                              | No grants/deadlines/eligibility claims                                   |
| `/auth/sign-in`        | Shared branded auth layout; one form; institutional role explanation; student/public paths                                                                           | Role resolved server-side; safe return URL                               |
| `/auth/sign-up`        | Explicit student registration; confirmation outcome; provisioned-account note                                                                                        | No role input/metadata; safe return URL                                  |
| `/auth/forbidden`      | Branded access state with account/workspace, public research, sign-out recovery                                                                                      | No role leakage or client authorization                                  |

## 6. Exact shared files likely to change

Phase A/shared foundation:

- `app/globals.css`
- `app/layout.tsx`
- `components/ui/index.tsx` (or carefully split primitives)
- `components/shared/page-header.tsx`
- `components/shared/empty-state.tsx`
- `components/shared/status-badge.tsx`
- `components/shared/ijmr-logo.tsx` or replacement `components/shared/brand-logo.tsx`
- approved new assets under `public/brand/`
- `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`

Header/footer/auth:

- `components/navigation/site-header.tsx`
- `components/shared/site-footer.tsx`
- `components/navigation/auth-shell.tsx` or `components/auth/auth-layout.tsx`
- `features/auth/sign-in-form.tsx`
- `features/auth/sign-up-form.tsx`
- `features/auth/actions.ts`
- `app/auth/sign-in/page.tsx`
- `app/auth/sign-up/page.tsx`
- `app/auth/forbidden/page.tsx`

Public route phases touch their corresponding `app/(public)/**` pages and typed components in `components/research/**` and `components/projects/**`. Participation repair additionally touches `features/participation/interest-form.tsx` and a server-action adapter near the project route/feature.

## 7. Motion strategy

1. Implement static layout, keyboard order, focus, and reduced-motion outcomes first.
2. Use CSS transitions for hover/focus/press, underline, header surface, opacity, and small transforms.
3. Prototype the relationship rail and mobile menu without a dependency.
4. In Phase G only, install `motion` if coordinated enter/exit/layout behavior materially improves those two interactions.
5. If installed, use `LazyMotion`/`m` or the narrowest official API in small client islands; never convert data routes or root layout to client components.
6. Centralize durations/easing and reduced-motion policy. No element should require animation to reveal information or complete an action.

## 8. Auth redesign strategy

- Fix missing auth/support classes and heading contrast as part of the token/CSS foundation.
- Keep one email/password sign-in. Add no role selector and no separate admin/researcher login.
- Add an institutional-access panel explaining that researcher/staff/admin accounts are provisioned and routed by the server.
- Make sign-up visibly student-only before the first field and in the submit/success copy.
- Implement a reusable accessible password field with show/hide, correct autocomplete, and stable keyboard order.
- Preserve current server-side Zod validation and Supabase action behavior.
- Accept a validated relative `redirectTo`, carry it through auth, and fall back to the server-derived role workspace. Never accept an external URL or trust a client-provided role.
- Display the correct case after sign-up: immediate authenticated session vs email confirmation required.
- Redesign forbidden recovery around the authenticated account and public escape routes.

## 9. Implementation phases and acceptance criteria

### Phase A — correctness, brand decision, tokens, typography, and shell primitives

Order:

1. Fix the false participation success, unsupported participation copy, global heading contrast, and homepage failure coupling.
2. Confirm the provenance/permission of `logo.svg`; place approved variants under `public/brand/`.
3. Consolidate color/type/spacing/radius/shadow/motion/container tokens.
4. Replace runtime font import with a stable Next-compatible delivery path.
5. Consolidate button/link/form/state primitives and remove false hover affordances.
6. Establish `PageIntro`, `SectionHeader`, state frame, and containers without redesigning every route.

Acceptance:

- Real project interest writes or returns a real server failure; no simulation exists in production.
- Dark-surface headings pass contrast and component color context wins.
- One token-backed control system exists; no new hard-coded brand hex values.
- Approved logo source and variants are documented.
- Check, tests, Webpack build, keyboard smoke test, and 375/768/1024/1440 shell smoke tests pass.

### Phase B — header, footer, and navigation

- Add verified brand lockup and Digital Hub relationship.
- Add active state/`aria-current`, responsive primary/secondary navigation, role account cluster, and accessible mobile behavior.
- Add verified official IJMR resource links in the footer.

Acceptance: current route and account destination are obvious; menu works by keyboard/Escape and closes on navigation; no route is dead-ended.

### Phase C — homepage

- Make the hero a five-second product thesis.
- Use honest scoped search and one real featured relationship preview.
- Replace equal section grids with an editorial hierarchy and independent failure handling.

Acceptance: a judge can identify the product, its difference from the journal, discovery entry, and participation path without scrolling through fake metrics.

### Phase D — public directories

- Redesign research, researcher, project, and publication indexes with typed result patterns.
- Unify query/filter presentation and URL state.

Acceptance: each directory scans quickly, has coherent selected/empty/error/loading states, and uses only public database fields.

### Phase E — entity detail pages

- Introduce breadcrumb and relationship rail.
- Give researcher, area, project, and publication pages distinct information architecture.
- Reserve future grounded-paper placement in documentation/layout structure only.

Acceptance: each page answers where, why, and next; relation links use public/published records; mobile order is logical.

### Phase F — authentication

- Implement the shared auth composition, institution/student explanation, password controls, return context, and forbidden recovery.

Acceptance: public signup cannot submit or obtain a privileged role; both Supabase signup outcomes are honest; project-to-auth return works; keyboard/autofill/error states pass.

### Phase G — purposeful motion

- Decide whether CSS is enough. If not, add Motion only for relationship, filter/result, or mobile menu choreography.

Acceptance: reduced motion is equivalent and immediate; no information depends on animation; client bundle change is measured and justified.

### Phase H — loading, error, empty, and 404 polish

- Add shell-aligned state frames and route-specific skeletons where latency is material.

Acceptance: states preserve context, announce appropriately, and always provide a useful recovery/next action.

### Phase I — responsive/accessibility/performance acceptance

- Test 375, 768, 1024, and 1440; keyboard all public/auth journeys; check contrast, headings, status text, reduced motion, long titles, and slow/error states.

Acceptance: no horizontal overflow or keyboard trap; 44px touch targets; visible focus; no serious console warnings; check/tests/build pass.

## 10. Dependencies

- Team confirmation that `logo.svg` is an approved official asset and which variants may be used.
- Hosted Supabase credentials/data for final interest and public-query smoke testing. Do not mutate schema.
- Coordination with WEB-6 so search labels and URL parameters do not diverge.
- Coordination with Qwen integration so the publication page reserves one stable boundary without implementing dead AI controls.
- Optional `motion` dependency only after Phase G decision.

No database migration or new content model is required for the planned public/auth redesign.

## 11. Merge-conflict and hot-file risks

Highest risk:

- `app/globals.css`
- `app/layout.tsx`
- `components/ui/index.tsx`
- `components/navigation/site-header.tsx`
- `components/shared/site-footer.tsx`
- `features/auth/actions.ts`
- `app/(public)/page.tsx`
- `app/(public)/projects/[slug]/page.tsx`

Medium risk:

- shared research/project cards while Sambhav/public work is active;
- publication detail while Qwen integration is active;
- auth forms while backend/auth changes are active;
- package files if Motion is later added.

Coordinate before each hot-file phase, merge foundation work before route branches, and avoid concurrent formatting sweeps.

## 12. What can safely be parallelized

After Phase A and B merge:

- Homepage composition can proceed separately from directories.
- Research/researcher directories can proceed separately from project/publication directories when shared primitives are frozen.
- Auth can proceed separately from public detail pages, except `features/auth/actions.ts` and project return flow need one named owner.
- State-page polish can proceed after `StateFrame` is merged.
- Accessibility QA can run continuously without broad implementation edits; defects should be assigned to the owning route.

Do not parallelize competing edits to tokens, root layout, header/footer, shared UI index, homepage, or project participation integration.

## 13. Estimated order

Use dependency order rather than artificial hour estimates:

1. Phase A correctness/foundation.
2. Phase B global navigation and footer.
3. Phase F auth, because it is currently broken and participates in the project conversion path.
4. Phase C homepage.
5. Phase D directories.
6. Phase E details.
7. Phase H global states.
8. Phase G motion only where static prototypes show a need.
9. Phase I acceptance throughout, with a final dedicated pass.

## 14. What should not be built

- Fake totals, citations, downloads, acceptance rates, funding, deadlines, achievements, or project progress.
- Role-selecting auth, separate admin/researcher login systems, OAuth, or password reset unless separately scoped.
- A copied OJS submission/review interface.
- A graph visualization library for the relationship rail.
- A client-rendered public app shell.
- Autoplay carousels, parallax, cursor-follow effects, animated blobs, or animation on every section.
- Qwen/“Ask this paper” UI, recommendations, or comparisons in this redesign phase.
- Events, opportunities, grants, notifications, analytics, or new schema.
- A universal card abstraction that erases entity differences.
- Unverified local/remote logos, hotlinked official assets, or copied policy text.

## 15. Phase A go/no-go

Implementation can begin now. Phase A must be a small coordinated foundation branch containing:

1. the four P0 correctness/contrast/resilience repairs;
2. approval and local placement of the official brand asset;
3. token/type/container consolidation;
4. stable font delivery;
5. unified buttons, links, fields, focus, and state primitives;
6. responsive shell and accessibility smoke tests.

Do not add Motion or redesign all routes in Phase A. Its purpose is to make every later page change safe, coherent, and reviewable.
