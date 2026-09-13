# Design system

The R&D Hub is a connected research index. Its visual system supports the journey **Discover → Understand → Connect → Participate** and helps every public page answer: Where am I? Why does this matter? What can I do next?

## Direction

The local Stitch references informed an academic editorial direction rather than a page-by-page specification. The interface uses deep indigo and ink for structure, pale blue and paper surfaces for rhythm, restrained ruby accents for emphasis, and teal for published or verified states. Source Serif 4 is the preferred display face when available, with Georgia as the bundled fallback; Inter and system sans-serif handle controls and metadata. The implementation does not depend on remote fonts.

Use open sections, rules, background shifts, indexed rows, and selective cards. Cards should represent a clickable entity, bounded action, or bounded state. Do not place every section in a card. Keep institutional claims, statistics, metadata, and relationships grounded in PostgreSQL records. Every fictional record must visibly show `DEMO DATA`.

## Shared foundations

- `PageIntro` establishes route identity, a concise explanation, and an optional action without creating an oversized hero.
- `Breadcrumbs` provide location and use `aria-current="page"` on the current item.
- `RelationshipRail` renders a database-backed path through areas, researchers, projects, publications, and participation. It identifies the current entity, links available branches, and describes unavailable branches honestly.
- `SectionHeader` provides consistent section hierarchy and optional navigation.
- `Button`, `Badge`, `Input`, `Textarea`, `Select`, `EmptyState`, `StatusBadge`, and message components provide consistent controls and feedback.
- `PublicRouteLoading` and `PublicRouteState` preserve route context during loading and recovery.

The rail scrolls horizontally on narrow screens and becomes a compact grid where space allows. Its order and meaning remain clear without animation.

## Entity patterns

Entity types share typography, metadata, focus states, and spacing while retaining distinct compositions:

- **Research areas** use thematic indexed rows with real relationship availability and counts when they can be fetched in batches.
- **Researchers** use identity-led cards and deterministic initials when no portrait exists. Only stored names, positions, bios, areas, and demo status appear.
- **Projects** use work-focused cards and detail layouts with stored status, summary, team, areas, published outputs, and the real Get Involved handoff.
- **Publications** use dense editorial rows and a manuscript-width detail view with stored metadata, linked authors, projects, areas, and abstract.

Do not introduce one universal entity card. Do not invent portraits, titles, contacts, metrics, funding, progress, impact, deadlines, or publication metadata.

## Search and filters

Directory search uses one restrained command-surface grammar: an explicit label, native controls, URL-backed query parameters, a visible submit action, and a clear-results link when filters are active. Publication search is lexical title search; it must not imply unified or semantic search. WEB-6 remains the future connected-search boundary.

## States and route endings

Loading skeletons should resemble the resulting route and remain compact. Error states name the affected context, offer retry where safe, and link to a useful public route. Empty states explain what is absent and provide the next useful action. The branded not-found page routes visitors to Home, Research, Projects, and Publications.

Each route should end with one clear next path. Examples include browsing connected work, meeting researchers, reading published outputs, or continuing from Projects to Get Involved. Do not render inactive future actions.

## Interaction and motion

CSS is sufficient for the current interaction system, so WEB-29 adds no motion dependency or client-side animation layer. Hover and press feedback uses short 140–220ms transitions on interactive elements only. Focus remains visible. Under `prefers-reduced-motion: reduce`, nonessential animation and transitions are disabled. Information never depends on movement.

## Authenticated workspaces and research assistant

Student, researcher, and admin routes share one responsive workspace shell. At desktop, a sticky role rail separates account identity, destinations, public research, and sign-out. At smaller widths, a compact workspace bar opens a keyboard-accessible disclosure menu; Escape closes it and returns focus to its trigger. Active navigation uses `aria-current`.

Private routes use a denser application rhythm than public editorial routes. `workspace-page`, `workspace-page-header`, `workspace-section`, `workspace-panel`, `workspace-record`, and `workspace-status-strip` establish consistent margins, type, spacing, record rows, and compact metrics. Serif type identifies a page; sans-serif type carries operational headings, labels, records, and controls. Ruby is reserved for priority or action-required cues. Status text always accompanies color.

Researcher and admin workflows should read as queues and records rather than generic card dashboards. Put changes requested or operational attention first, then current status, then recent records. Generated manuscript codes, institutional-sounding governance claims, reviewer identities, deadlines, and other unsupported workflow details do not belong in private UI.

The Research Paper Assistant is one global, keyboard-operable dialog rather than separate route widgets. Its navy editorial header, paper selector, source metadata and quiet status treatment identify it as an indexed-research tool—not a general chatbot. Publication detail pages may open it with exact deterministic paper context; assistant failure never replaces page content.

## Responsive and accessible behavior

Public layouts are designed for 375px, 768px, 1024px, and 1440px widths. Long titles wrap, filters stack before space becomes constrained, relationship paths remain reachable, and primary actions maintain practical touch targets. Use semantic headings, landmarks, native controls, descriptive navigation labels, accessible form labels, and text alongside color for state. All public journeys must work by keyboard with a logical focus order and no traps.

React Server Components remain the default. Use a client component only for browser interaction such as retrying an error boundary or opening the mobile menu. Batch relationship reads to avoid N+1 requests and avoid large image or animation payloads.

## Approved research assets

The root `assets/` directory is source material and is currently ignored by Git. Do not hard-code those files as publication attachments or copy them into public delivery paths until the team has verified the record mapping and distribution rights. For approved stable public downloads, use a tracked location under `public/resources/`. Use hosted Supabase Storage when documents need managed access, replacement, or database-linked metadata. Adding that asset model is outside WEB-29 and requires coordinated schema/storage work.
