# WEB-29 public UI/UX audit

Date: 2026-09-12  
Scope: public routes, authentication, global shell, shared public components, and future visual consistency. This is an audit only; no production UI was changed.

## 1. Executive diagnosis

The public product has the right information architecture and a useful connected-data premise, but its presentation does not yet make that premise visible. Most pages use the same sequence of a large `PageHeader`, controls, equal white cards, and an isolated final link. The result reads as several CRUD directories rather than one research ecosystem.

The strongest direction is **an academic research index with an editorial journal layer**. Discovery pages should behave like a connected index; entity pages should read like editorial dossiers; participation should feel like a deliberate handoff. Authentic IJMR identity should establish provenance, while the R&D Hub remains a distinct product for navigating relationships.

Three findings precede visual work:

1. `/projects/[slug]` does not pass `expressInterest` to `InterestForm`. An authenticated submission enters a timed, simulated success state and does not write to Supabase.
2. `AuthShell` and auth forms reference absent classes (`auth-grid`, `auth-story`, `auth-card`, `auth-mark`, `text-link`, `field-error`, and `field-help`). Global heading color rules also override utility colors on dark surfaces. Sign-in and sign-up are visually broken.
3. The homepage loads areas, projects, and publications in one `Promise.all`. A transient project query failure was observed collapsing the entire homepage into the root error boundary.

These are integration and CSS defects, not matters of taste. They belong at the start of implementation.

### Audit method and baseline

- Synced `dev` to `origin/dev` at `89d0b1b` and preserved the pre-existing untracked `logo.svg`.
- Inspected all 24 images under the gitignored `stitch/` directory, with detailed review of the eight public-facing references.
- Used the running app in a browser for the complete public journey, project participation handoff, auth loop, empty routes, and global states.
- Inspected route, component, query, action, validation, and CSS sources.
- Inspected the live [official IJMR site](https://ijmr.islingtoncollege.edu.np/index.php/IJMR), including its masthead, search, latest-article composition, issue panel, calls to action, and footer resources.
- Desktop behavior was exercised directly. The 375, 768, 1024, and 1440 assessments combine browser observation with breakpoint/source inspection; this environment did not expose a reliable viewport-resize control, so device testing remains an implementation acceptance task.

Baseline results:

- `npm run check`: pass.
- `npm test`: pass, 36 tests.
- `npm run build`: blocked by the known Turbopack sandbox restriction while processing `app/globals.css` (`Operation not permitted` while spawning/binding).
- `npm run build -- --webpack`: pass; all current routes generated.

## 2. Stitch reference analysis

The references establish hierarchy and interaction ideas, not factual content. Their best shared traits are a compact journal masthead, editorial type, navy/ruby/teal restraint, dense metadata where it aids reading, asymmetric detail layouts, prominent search, human researcher anchors, and strong page endings.

| Stitch reference | Applicable route/component | Keep | Adapt | Reject and reason |
|---|---|---|---|---|
| Academic events & research symposia | `/events` | Editorial listing rhythm, date hierarchy | Use as an intentional empty/future route until records exist | Invented event schedule, speakers, venue, and registration |
| Author proofing / camera-ready workspace | Future private workflow | Compact status and document hierarchy | Use only as visual consistency guidance | Unsupported production workflow and manuscript metadata |
| Double-blind reviewer scorecard | Future admin/reviewer work | Clear decision hierarchy | Status vocabulary only | Scores, reviewer data, and criteria absent from v0.1 |
| Dr. Aasha Sharma faculty profile | `/researchers/[slug]` | Human focal point, 8:4 profile/related-work layout | Use initials if no approved portrait; show only stored position and links | Biography facts, contact details, achievements, and metrics |
| Author dashboard review pipeline | Future private workflow | Compact status timeline | Existing real statuses only | Fake journal stages, identifiers, editors, deadlines, and checks |
| Editor decision/rebuttal synthesis | Future admin workflow | Structured feedback presentation | Existing review notes only | Unsupported editorial scoring and manuscript apparatus |
| IJMR research community logo | `BrandLogo`, header/footer | Multicolor line motif and IJMR provenance | Verify against approved original; provide horizontal/dark variants | Recreating or tracing a substitute when an approved asset exists |
| IJMR research community homepage | `/`, header, footer | Strong search thesis, editorial feature hierarchy, dark closing band | Replace all figures and stories with database records; express Digital Hub distinction | Fake counts, recognition logos, journal claims, and unsupported subscription |
| Add co-author modal | Future submission expansion | Focused form hierarchy | Revisit only if schema supports authorship management | Modal-heavy unsupported author management |
| Author roster step | Future submission expansion | Clear people rows | Potential researcher-link pattern | Unsupported submission step and author controls |
| Submission receipt | Existing private submission feedback | Strong confirmation hierarchy | Apply to real action results | Fake manuscript number, dates, and tracking stages |
| Conflict disclosures | Future submission expansion | Accessible grouped choice pattern | Revisit when policy/schema exists | Unsupported disclosure fields |
| Final review confirmation modal | Future private workflow | Explicit consequential-action copy | Existing publish/resubmit actions only | Extra modal step without proven need |
| Peer-review workflow | Future private workflow | Legible progress language | Map only to current statuses | Invented reviewers, deadlines, and manuscript stages |
| NepalNLP project detail | `/projects/[slug]` | Question-led content, relation rail, anchored participation | Populate from current summary, team, areas, outputs, and real status | Objectives, milestones, funding, repository, and progress not in schema |
| Student fellow manuscript workspace | Future account/private workflow | Task-first information hierarchy | Potential account consistency reference | Fellow identity, manuscript metadata, tasks, and deadlines |
| Personalized researcher dashboard | Existing `/researcher` consistency only | Calm academic shell and action hierarchy | Preserve WEB-14’s real-data approach | Fake grants, compute, affiliations, and performance data |
| Research article: Devanagari NLP | `/publications/[slug]` | Manuscript column, metadata rail, author links | Use real abstract/year/DOI/relations; reserve a quiet future AI slot | Citations, downloads, issue metadata, PDF, and metrics absent from schema |
| Research discovery search | `/research`, `/publications`, future WEB-6 | Search as command surface, scoped filters, result density | One coherent search grammar backed by actual query parameters | Unsupported advanced facets and recommendation claims |
| Student grants/opportunities | `/opportunities` | Clear eligibility/action hierarchy | Use as future layout boundary | Grants, money, deadlines, and eligibility not backed by records |
| Research projects & labs | `/projects` | Status-aware filtering and varied editorial cards | Use real project fields and relationships | Labs, funding, progress, capacity, and fake activity |
| Researcher faculty directory | `/researchers` | Human cards, role metadata, strong filters | Initials fallback and real positions/areas | Portraits, departments, availability, email, and achievements without data |
| Research community platform overview | Global product shell | Connected-entity story and restrained institutional tone | Translate into a relationship ribbon/diagram using real links | Broad feature promises not implemented |
| Referee dispatch console | Future admin workflow | Dense operational scanning | Reference only for later work | Reviewer assignment, deadlines, identities, and scoring |

### Design intent to carry forward

- Use one signature device: a **relationship rail** that shows the current entity and real next connections (area → people → projects → publications → participation). It should be data-driven and become a compact horizontal trail on mobile.
- Vary layout according to content. Directories may use rows, featured items, and compact results rather than identical card grids. Detail pages may use a readable main column and a narrow relationship rail.
- Use rules, metadata, and typographic contrast to group content before reaching for a bordered card.
- Keep motion concentrated around discovery, navigation state, relationship changes, and action feedback.

## 3. IJMR branding audit

The official site presents IJMR as a journal, while this product is the cross-entity R&D discovery layer. The relationship should read **“IJMR / Islington College” as provenance, “R&D Digital Hub” as product**.

Observed official signals:

- A multicolor linear `IJMR` mark paired with a dark serif journal wordmark and the line “Knowledge. Innovation. Impact.”
- A dark navy utility bar, white masthead, near-black/navy text, teal search/action controls, thin neutral borders, and generous white space.
- Serif identity for the journal wordmark with sans-serif navigation, search, metadata, and body copy.
- Search-led home composition, editorial article list, current-issue side panel, call-for-papers card, and dense legitimacy footer.

The root `logo.svg` appears to contain the same spectrum colors (`#FFC609`, `#EE4554`, `#7CC142`, `#00B5A2`, `#0076BB`) plus dark `#2F3344` and white variants. It is untracked and its provenance has not been established in Git. Treat it as a supplied candidate, not an approved production asset, until the team confirms its source and variant/cropping suitability.

Recommended asset policy:

- After confirmation, store the approved source under `public/brand/` with horizontal, mark-only, dark-surface, and light-surface variants.
- Do not hotlink the live journal asset.
- Do not trace or recreate the official logo if an approved original is available.
- Keep the official journal site as an outbound resource rather than copying its publication system.

Useful official outbound links are the [journal home](https://ijmr.islingtoncollege.edu.np/index.php/IJMR), [author/submission guidance](https://ijmr.islingtoncollege.edu.np/index.php/IJMR/about/submissions), [aims and scope](https://ijmr.islingtoncollege.edu.np/index.php/IJMR/aims-scope), [ethics and policies](https://ijmr.islingtoncollege.edu.np/index.php/IJMR/ethics-policies), [peer-review process](https://ijmr.islingtoncollege.edu.np/index.php/IJMR/peer-review-process), and [official contact section](https://ijmr.islingtoncollege.edu.np/index.php/IJMR/about#contact). Link these from a compact “Journal resources” footer area; do not reproduce policy text or the journal’s login/submission system.

## 4. Current design-system audit

### What works

- The intended Source Serif 4 / Inter pairing fits academic editorial content.
- Navy, ruby, teal, pale blue, and slate are directionally aligned with Stitch and the official site.
- Focus-visible and reduced-motion base rules exist.
- Buttons and form primitives have adequate base target sizes.
- `DemoBadge` and workflow status badges protect data fidelity.

### What prevents consistency

- Tokens cover only part of the UI. Components continue to hard-code variants of `#0f2042`, `#9e1b32`, `#eff4ff`, slate utilities, radii, and shadows.
- Global element selectors set heading color after Tailwind and override local `text-white` utilities. Dark section headings render with insufficient contrast.
- `transition: all` is used in global card/button classes. It is imprecise and can animate unintended properties.
- Every `.academic-card` rises on hover, including noninteractive content. This creates false affordance.
- The type classes are named but not applied as a coherent scale. `PageHeader` makes many pages feel equally loud.
- Fonts arrive through a runtime Google CSS `@import`, which can produce layout shifts and weak offline/demo reliability.
- Several class APIs are defined twice: global `.btn-academic-*` and `components/ui` variants use slightly different tokens and radii.
- Shared link, field help/error, and auth layout classes are referenced but absent.
- `components/shared/ijmr-logo.tsx` is synthetic; the current header instead shows a generic Lucide book, so neither provides verified brand identity.

### Recurring generic/AI-generated patterns

| Pattern | Why it weakens the product | Specific replacement |
|---|---|---|
| Large header + repeated two-column cards | Entity type and importance disappear | Give each directory a characteristic result primitive and one featured real record |
| Card around every section | Borders replace hierarchy; pages become component galleries | Use editorial rules, background bands, and open type-led sections; reserve cards for actionable/bounded units |
| Identical “Explore →” blocks | Actions do not communicate distinct outcomes | Use specific verbs: “See researchers in this area”, “Read publication”, “Express interest” |
| Huge whitespace around one or two records | Sparse data feels unfinished | Use compact indexed rows, relationship summaries, and honest empty sub-sections |
| Uppercase/mono metadata everywhere | Creates artificial “system” tone | Reserve uppercase for 1–2 short taxonomy labels; use sentence case for most metadata |
| Hover elevation on passive panels | Suggests clickability where none exists | Apply hover/focus treatment only to an element that is one complete link |
| Same PageHeader on every route | Weak orientation and no route personality | Add breadcrumbs/context, result counts, or metadata appropriate to the entity |
| Generic icon + headline + paragraph | Looks like a component library demo | Prefer actual entity data, typographic labels, and relationship links |
| Repeated pale-blue CTA cards | Dilutes participation emphasis | Use one dark or lightly tinted conversion band at the true next step |
| Multiple button implementations | Small visual drift compounds across routes | One `Button`/link-button API backed by tokens |

## 5. Route-by-route findings

### `/`

The message is understandable, but search sends users specifically to publications while the hero promises broader discovery. The numbered journey is a real sequence, yet the four equal blocks and repeated “Explore” links flatten it. Areas, projects, and publications follow as three disconnected component demos. One rejected promise: do not add fake ecosystem counters. Use one real featured area to expose its people/projects/publications relationships, followed by a compact editorial latest-research list and a single participation close. Fetch sections independently so one transient source does not replace the entire homepage.

### `/research`

The route looks like a category directory. Search and cards work, but areas need to communicate their role as thematic hubs. Add a concise taxonomy introduction, real linked entity counts only if queries provide them, and differentiated area rows/cards that preview available relation types. Preserve broad public access and URL-backed search.

### `/research/[slug]`

The correct relational content exists, but it is presented as consecutive sections. Add a breadcrumb, a compact area identity, and a data-driven relationship rail. Researchers, projects, and publications should each expose the next route without duplicating equal card grids. Missing relationships need specific empty copy.

### `/researchers`

One sparse rectangular card does not feel human. Introduce initials as a deterministic fallback; use real name, position, areas, and DEMO DATA state. Prefer compact profile rows/cards with a clear identity anchor. Do not add portraits unless an approved field and asset source exist.

### `/researchers/[slug]`

The page has real relations but opens like another directory page. Use a profile masthead with initials, stored position, and research areas; place biography in a readable column and connected projects/publications in a secondary rail. Do not infer titles, departments, email, memberships, or achievements.

### `/projects`

Filtering is useful, but the filter bar and cards are visually generic. Use a compact status control with a visible selected state, show the active result context, and distinguish ongoing/proposed items without relying on color. A duplicate unused `ProjectFilterBar` suggests the route and shared component have diverged.

### `/projects/[slug]`

This is the closest page to the desired detail architecture. It already answers what, who, area, outputs, and participation. The participation integration is currently broken, and several claims exceed the schema. After fixing the action, tighten the 8:4 composition, make the participation eligibility/status honest, and remove unsupported faculty PI, co-authorship, confidentiality, and application language.

### `/publications`

Search and results work but do not yet carry IJMR editorial character. Use a publication index/list with title, authors, year, and linked context; reserve cards for a featured item. Search controls should share the future WEB-6 grammar without claiming facets not implemented.

### `/publications/[slug]`

The large title and abstract are readable, but metadata and relations are weakly composed. Use a manuscript-width abstract, a metadata rail for real year/DOI/publication date, linked authors, areas and projects, and a restrained DEMO DATA treatment. Reserve a clearly labelled future slot after the abstract/metadata for “Ask this paper”, “Related research”, and “Compare research”; do not render dead controls now.

### `/events`

The empty state is honest but the primary-navigation absence/presence story is unresolved and the page ends abruptly. Keep it out of the main desktop nav until real records exist. Link it from a secondary “Coming next” area and give the empty state a route back to research.

### `/opportunities`

Like events, it is honest but nearly indistinguishable. Keep it secondary until a model and records exist. The current project-level interest flow is the credible participation entry; direct visitors there rather than implying an opportunity catalogue.

### `/auth/sign-in`

The route is functionally secure but visually broken because its layout and field-support classes are missing. It needs one shared institutional auth panel, explicit “one sign-in, server determines access” copy, a student registration path, institution-provisioned researcher/staff explanation, password reveal, error summary/field association, pending feedback, and preserved return context.

### `/auth/sign-up`

The backend correctly accepts no role and creates a student account through the database model. The interface should say “Create a student account” throughout, explain confirmation behavior, show password requirements before failure, include accessible reveal controls, and state that researcher/admin accounts are provisioned. It should return to the initiating project after a usable session or after later sign-in.

### `/auth/forbidden`

The generic empty state explains the role mismatch but offers the wrong default recovery and too much blank space. Show the current access boundary without exposing sensitive profile data, provide “Go to my workspace/account”, “Browse public research”, and sign-out options, and retain professional tone.

## 6. Auth UX findings

The product needs one auth system and one visual entry. Do not add role selectors or “login as” controls. The recommended panel has:

- an IJMR/R&D identity header and concise trust statement;
- a single email/password form;
- a visible institutional-access note: researchers, staff, and administrators use accounts provisioned by Islington; the server determines their workspace;
- a student path: create a student account;
- a public path: continue browsing without an account;
- password show/hide with a text alternative, preserved browser autocomplete, `aria-describedby`, inline errors, and an error summary on submit;
- distinct pending, invalid credentials, email-confirmation, and success states;
- validated, same-origin `redirectTo` carried through sign-up/sign-in so a project-interest journey returns to the project.

The existing role redirect in `features/auth/actions.ts` is the source of truth and should remain server-side.

## 7. Navigation and footer findings

### Header

- The generic book icon and split text do not establish IJMR provenance.
- No active state is rendered even though `.nav-link-active` exists.
- Desktop navigation waits until `xl`, leaving many laptop/tablet widths with only the compact menu.
- The native `<details>` menu is keyboard-operable, but does not provide polished focus management, outside-click/Escape behavior, or reliable close-on-navigation.
- Account links use underlines instead of the shared action hierarchy.
- Sticky behavior is appropriate; scroll transformation should be limited to a subtle height/border/background change and must not hide controls.

Recommended information architecture: Home, Research, Researchers, Projects, Publications. Keep Events and Opportunities secondary until they contain records. Show the role-appropriate workspace/account and sign out from the same account cluster.

### Footer

The current footer closes the page but does little to prove legitimacy. Add verified IJMR identity, a short explanation of how the Digital Hub relates to the journal, internal discovery links, and official outbound links for author guidance, aims/scope, ethics, peer review, and contact. Do not copy addresses, policy content, metrics, indexing/recognition claims, or newsletter controls into the Hub unless explicitly approved and maintained.

## 8. Motion and microinteraction findings

Use native CSS for color, border, underline, opacity, and transform transitions. Motion should communicate state or relationship:

- one restrained hero/relationship reveal;
- active navigation underline and compact sticky-header transition;
- filter/result transition that preserves focus and announces result counts;
- card-link hover/focus using the same 2–4px lift only on interactive cards;
- arrow movement tied to a specific link;
- button pressed/pending state and action-success/error feedback;
- mobile menu enter/exit and focus return;
- skeleton shimmer or opacity pulse at low contrast;
- relationship rail transitions when a selected featured entity changes.

Do not use ambient floating, parallax, cursor followers, scrambled text, autoplay carousels, or reveal every element. All motion must stop or collapse to an immediate state under `prefers-reduced-motion`.

## 9. Responsive findings

| Route/group | 375px | 768px | 1024px | 1440px | Main risk |
|---|---|---|---|---|---|
| Global header | Needs rework | Needs rework | Needs polish | Needs polish | Menu takeover below `xl`, weak active/account model |
| Home | Needs rework | Needs polish | Needs polish | Needs polish | Long vertical card stacks and oversized repeated headings |
| Directories | Needs polish | Needs polish | Needs polish | Needs polish | Controls and sparse equal cards do not use width well |
| Entity details | Needs rework | Needs polish | Needs polish | Needs polish | Long titles/metadata and sequential relationships on mobile |
| Project participation | Needs rework | Needs rework | Needs polish | Needs polish | Dense disabled form, wrapping action rows, unsupported copy |
| Events/opportunities | Needs polish | Needs polish | Needs polish | Needs polish | Excessive blank space and abrupt page ending |
| Auth | Broken | Broken | Broken | Broken | Missing layout classes and heading contrast |
| Global states | Needs rework | Needs rework | Needs rework | Needs rework | No page container/context, visible layout flash |

Implementation QA must explicitly test no horizontal overflow, 44px touch targets, long titles, form error wrapping, filter wrapping, sticky-header offset, and mobile relationship-rail order.

## 10. Accessibility findings

Strengths include a skip link, semantic labels, URL-backed filters, `aria-live` form status, focus-visible base styling, and reduced-motion CSS. Risks:

- global heading colors break contrast on dark surfaces;
- the skip link becomes visible without positioned, high-contrast styling;
- auth field error/help classes are missing, reducing visible feedback quality;
- passive cards animate on hover and imply clickability;
- active navigation lacks `aria-current="page"`;
- the menu trigger says “Open” even when expanded and has limited focus/escape behavior;
- status must retain text, not color alone;
- filter/search result counts should be announced after navigation/update;
- loading skeletons need contained status copy without repeated noisy announcements;
- password reveal buttons need accessible state labels;
- page heading sizes need a single logical `h1` and consistent section nesting.

## 11. Performance concerns

- Runtime Google Fonts `@import` can delay text, produce layout shift, and make a demo dependent on a third-party stylesheet. Prefer `next/font` or approved self-hosted files; retain robust system fallbacks.
- The public root is `force-dynamic`, and the async header queries the viewer on every request. Measure before changing, but keep motion out of these Server Component boundaries.
- Homepage `Promise.all` couples otherwise independent sections and weakens resilience.
- A full `motion` component import is about 34 KB according to Motion’s own guide; `LazyMotion` can reduce initial animation features substantially. Do not convert whole server pages to clients for reveals.
- Avoid large hero images. If approved imagery is added, use responsive `next/image`, fixed aspect ratios, explicit sizes, and local optimized files.
- Avoid animation-driven layout properties; use opacity and transform.

## 12. Actual bugs and prioritized defects

### P0 — demo breaking

| Route | Component/file | Problem | Expected behavior | Recommended fix |
|---|---|---|---|---|
| `/projects/[slug]` | `app/(public)/projects/[slug]/page.tsx`, `features/participation/interest-form.tsx` | No `onSubmitAction` is passed; authenticated submission runs simulated success | A student submission writes a real `project_interests` record or shows a real server error | Bind a project-specific server action adapter to `expressInterest`; remove production fallback simulation; query duplicate state |
| `/auth/sign-in`, `/auth/sign-up` | `components/navigation/auth-shell.tsx`, auth forms, `app/globals.css` | Referenced auth/link/error/help classes do not exist; headings on intended dark story surfaces inherit dark ink | Auth is readable, contained, responsive, and correctly branded | Implement the missing shared auth styles/components and resolve selector specificity in Phase A/F |
| `/` and every dark surface | `app/globals.css`, homepage/footer | Global `h1…h6 { color: var(--ink) }` overrides local light text utilities | Explicit component/theme color wins and meets contrast | Move heading color to inherited/tokenized context or lower-specificity base styles |
| `/` | `app/(public)/page.tsx` | One transient query error replaces all homepage content with root error; observed for projects | Independent sections degrade independently and keep the shell/other content available | Use independent settled/error boundaries or section-safe query results |

### P1 — major UX / broken flow

| Route | Component/file | Problem | Expected behavior | Recommended fix |
|---|---|---|---|---|
| Project → auth → project | `InterestForm`, auth pages/actions | `redirectTo` is generated but ignored | Safe local return URL survives sign-up/sign-in | Validate and thread same-origin relative return path through server actions |
| `/projects/[slug]` | `InterestForm`, participation callout | UI promises faculty PIs, co-authorship, confidentiality, applications, dossiers, and placement cycles without supporting data/contracts | Copy describes only stored expression of interest and admin review | Replace with neutral, accurate participation copy |
| Auth routes | auth pages/forms | Provisioned researcher/admin access is not clearly explained; no password reveal | One secure form clearly explains student signup and institutional accounts | Add `RoleAccessInfo`, reveal controls, and contextual success/error hierarchy |
| Global navigation | `SiteHeader` | No active state; medium/laptop layouts collapse early; menu behavior is basic | Location and account/workspace are obvious at every width | Add pathname-aware small client nav island or route segment strategy with `aria-current`; improve menu |
| Global loading/error/404 | `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx` | States are uncontained, generic, and cause a visually abrupt flash | Branded, contextual states preserve navigation and give recovery paths | Build shared state frame and route-specific skeletons where data latency warrants |
| `/` search | `SearchForm`, homepage copy | Broad discovery promise routes to publication-only search | Label and behavior agree | Call it publication search now or implement WEB-6 before broadening language |

### P2 — visual polish

| Route | Component/file | Problem | Expected behavior | Recommended fix |
|---|---|---|---|---|
| All | `app/globals.css`, `components/ui/index.tsx` | Duplicate button systems and hard-coded values drift | One token-backed component API | Consolidate styles after token work |
| All card pages | `.academic-card` | Passive cards lift on hover | Hover implies an action | Limit hover to linked/actionable card primitive |
| Directories | route pages and entity cards | Repeated equal grids and large PageHeaders | Entity-specific scan patterns | Introduce typed cards/rows and contextual headers |
| `/projects` | route and `ProjectFilterBar` | Inline filter implementation coexists with an apparently unused shared filter | One maintained filter pattern | Choose and test a single implementation |
| Root | `app/layout.tsx` | Next warns that smooth scrolling lacks `data-scroll-behavior="smooth"` | No framework warning | Add the documented attribute or remove global smooth scrolling |
| All | `app/globals.css` | Fonts depend on runtime `@import` | Stable font rendering | Move to `next/font` or approved self-hosted assets |

### P3 — optional enhancement

- Data-driven featured-entity relationship preview on the homepage.
- Initial-based researcher identity accents with deterministic colors.
- Motion-enhanced relationship rail after the static and reduced-motion behavior is complete.
- Reserved, noninteractive publication integration boundary for future grounded-paper tools.

The React hydration warnings observed in the development console contained attributes such as `bis_skin_checked` injected by a browser extension. They are environmental and should not be “fixed” in application code.

## 13. Page scorecard

Scale: 1 = broken/absent, 3 = functional but generic, 5 = polished and coherent.

| Route | Visual | Hierarchy | Brand | Interaction | Responsive | Accessibility | Product flow | Status | Weakest dimension |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| `/` | 2 | 3 | 2 | 2 | 3 | 3 | 4 | Needs rework | Query resilience and disconnected presentation |
| `/research` | 2 | 3 | 2 | 2 | 3 | 4 | 3 | Needs rework | Thematic hubs look like categories |
| `/research/[slug]` | 2 | 3 | 2 | 1 | 3 | 4 | 4 | Needs rework | Relationships are sequential, not visible as a system |
| `/researchers` | 2 | 3 | 2 | 2 | 3 | 4 | 3 | Needs rework | Human identity is absent |
| `/researchers/[slug]` | 2 | 3 | 2 | 1 | 3 | 4 | 4 | Needs rework | Profile composition is generic |
| `/projects` | 2 | 3 | 2 | 3 | 3 | 4 | 4 | Needs polish | Filtering/result hierarchy |
| `/projects/[slug]` | 3 | 3 | 2 | 1 | 3 | 3 | 4 | Broken | Participation reports false success |
| `/publications` | 2 | 3 | 2 | 2 | 3 | 4 | 3 | Needs rework | Weak editorial identity |
| `/publications/[slug]` | 2 | 3 | 3 | 1 | 3 | 4 | 4 | Needs rework | Metadata and related work composition |
| `/events` | 2 | 3 | 2 | 1 | 4 | 4 | 2 | Needs polish | Dead-end route |
| `/opportunities` | 2 | 3 | 2 | 1 | 4 | 4 | 2 | Needs polish | Dead-end route |
| `/auth/sign-in` | 1 | 2 | 1 | 2 | 2 | 3 | 3 | Broken | Missing styles/contrast |
| `/auth/sign-up` | 1 | 2 | 1 | 2 | 2 | 3 | 3 | Broken | Missing styles/role explanation |
| `/auth/forbidden` | 2 | 2 | 1 | 1 | 3 | 4 | 2 | Needs rework | Recovery path and identity |

## 14. Library research

### Primary recommendation: Motion for React, deferred until Phase G

- **Purpose:** coordinated menu transitions, one homepage/relationship reveal, and stateful filter/result transitions that CSS cannot express cleanly.
- **Compatibility:** official installation guidance supports React 18.2+ and both Next.js routers; it provides `motion/react-client` for React Server Component environments. React 19 refs are supported. See [Motion installation](https://motion.dev/docs/react-installation) and [Motion component guidance](https://motion.dev/docs/react-motion-component).
- **Bundle/complexity:** Motion documents roughly 34 KB for the full `motion` component API, while `LazyMotion`/`m` can reduce the initial feature cost to about 4.6 KB; `useAnimate` mini is about 2.3 KB. See [bundle-size guidance](https://motion.dev/docs/react-reduce-bundle-size).
- **Client boundary:** use only small client islands. Do not wrap the app, route layouts, or data-rendering Server Components merely to animate them.
- **Accessibility:** centralize reduced-motion behavior through `MotionConfig`/`useReducedMotion` plus the existing CSS media query.
- **Decision:** do **not** install in Phase A. First complete the static system with CSS transitions. Install Motion in Phase G only if the relationship/search/menu prototypes still need coordinated enter/exit/layout animation. Do not add React Bits, AutoAnimate, GSAP, or a second motion dependency.

Native CSS remains the default for hover, focus, press, underline, header background, and skeleton transitions.

## 15. Data-integrity risks

- Participation language currently invents faculty PI review, confidentiality, co-authorship, applications, research-assistant eligibility, dossiers, placements, and editorial cycles.
- Homepage language implies connected/global search while the form searches publications only.
- Stitch references contain counts, issue metadata, downloads, citations, funding, progress, awards, deadlines, labs, and contacts that are not present in this database.
- The official IJMR site has real metrics and publication claims, but they belong to that maintained journal. Do not transplant them as Digital Hub metrics.
- Portraits and researcher contact details need an approved field/source and consent policy; initials are the safe current fallback.
- “Ask this paper”, recommendations, and comparisons must remain absent until their secure, grounded behavior exists.
- Continue to display `DEMO DATA` for all invented institutional records. Visual polish must never reduce its visibility.

## Audit conclusion

The redesign is ready to begin after the P0 integration issues are made explicit in the first implementation branch. Phase A should establish the verified brand asset decision, token and typography foundations, CSS specificity repair, one component styling API, page containers, and the global state frame. It should not redesign every route at once or add Motion.
