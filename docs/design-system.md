# Design system

The hub is a research index with a clear route from ideas to participation. The local Stitch references establish a modern academic editorial direction: deep indigo `#0f2042`, ink `#0b1c30`, paper `#f8f9ff`, white surfaces, muted slate, restrained ruby `#9e1b32`, and teal for verified or published states. Source Serif 4 is the preferred display face when available, with Georgia as the bundled fallback; Inter/system sans-serif handles controls and metadata. No remote font dependency is required. A four-stage journey panel on the homepage makes Discover → Understand → Connect → Participate visible.

Use shared Button, Card, Badge, Input, Textarea, Select, PageHeader, EmptyState, StatusBadge and loading/error feedback. Native controls keep keyboard behavior predictable; shadcn-style composable primitives avoid unnecessary dependencies. Entity cards show type, title, summary and next link. No dead ends: empty states give a relevant next action. Status text never relies on color alone. All fictional records show DEMO DATA.

Use pale blue surface bands, compact uppercase eyebrows, thin borders, small radii, restrained shadows, and 8:4 content/metadata layouts where the content supports them. Do not reproduce unsupported statistics, journal machinery, people, claims, or fields from Stitch. Design references guide hierarchy and treatment; PostgreSQL remains the source of product facts.

Responsive by default: single-column forms, wrapping navigation, readable line lengths, cards that collapse to one column. Visible focus, explicit labels, descriptive headings and live feedback after actions. Prefer pages to modal-heavy flows. Shared CSS/tokens require coordination. Keep styling restrained during the hackathon.
