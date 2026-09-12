# Research operations intelligence

WEB-17 and WEB-22 use a deterministic server-side operations layer in `features/operations/`. The feature is an explainable rules and count system. It does not use AI, recommendations, background jobs, or a new database schema.

## Configurable freshness defaults

The thresholds in `features/operations/constants.ts` are hackathon demonstration defaults. They are not Islington College policy or service-level commitments.

- Submitted or under-review publication with no update for 7 days: high-priority stale review.
- Changes-requested publication with no update for 14 days: medium-priority inactive response.
- Ongoing project with no update for 60 days: low-priority stale project record.

The pure `buildAttentionItems()` function normalizes records into stable keys, rule types, severity, reasons, entity links and timestamps. It de-duplicates and sorts by severity, oldest update and stable key. Invalid timestamps do not generate alerts.

## Query and authorization boundary

`getAdminOverview()` requires the admin role through the existing server guard. It runs exact PostgreSQL count queries for published publications, pending/reviewing submissions, changes requested and projects. It fetches only the limited fields required by the freshness rules and does not read or expose private review notes.

The returned metrics and attention items are presentation-independent so future role-aware dashboard work can reuse counts and actionable links. The current admin overview renders four real metrics and a compact attention list with an honest empty state.

PGlite and pure rule tests cover threshold boundaries, wrong statuses, project freshness, normalized severity/type values and duplicate suppression. Hosted Supabase acceptance remains pending until the shared migrations and role-based acceptance matrix are completed.
