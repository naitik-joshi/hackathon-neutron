# Private UI baseline

Date: 2026-09-13  
Starting integration commit: `7aec102`

## Method and authentication constraint

The local application was inspected through the browser and source at the start of Phase 1. The active hosted session had expired and `/account` correctly redirected to `/auth/sign-in`. The expected `DEMO_QA_STUDENT_*`, `DEMO_QA_RESEARCHER_*`, and `DEMO_QA_ADMIN_*` variables were not present in `.env.local`. The project owner later supplied the demo credentials directly for browser acceptance; they are not recorded here.

## Baseline classification

| Area                        | Classification  | Observation                                                                                                                      |
| --------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Student `/account`          | POOR            | Sparse single-card account summary; no view of the user’s real expressions of interest.                                          |
| Researcher overview         | POOR            | Real data and actions exist, but oversized public-style headers and five equal KPI cards weaken action priority.                 |
| Researcher publications     | POOR            | Public directory presentation is reused for a private workflow; changes requested and updated dates are not prominent enough.    |
| Researcher detail/form      | ACCEPTABLE      | Secure workflow is complete, but the content hierarchy is card-heavy and does not reserve a clear future preflight boundary.     |
| Admin overview              | POOR            | Real metrics and Needs Attention exist, but a large KPI grid and inflated editorial language bury the operational queue.         |
| Admin queue                 | POOR            | Functional filters and real records exist; visual density, manuscript terminology, and mobile action layout need simplification. |
| Admin detail                | POOR            | Complete workflow, but long dossier framing, invented-sounding labels, and too many nested panels obscure the decision action.   |
| Admin interests             | POOR            | Real data is available; telemetry and institutional language make a simple interest inbox harder to scan.                        |
| Shared workspace navigation | BROKEN at 375px | Horizontal destinations and account actions compete for one row. There is no true disclosure menu or Escape/focus behavior.      |

## Cross-route failures

- Private content width and side margins vary by route because some pages nest `page-shell` while others rely on layout padding.
- Public/editorial heading scale is applied to operational screens.
- Cards are used for almost every grouping, producing generic dashboards.
- Several admin labels overstate the implemented workflow: “Editorial Secretariat,” “peer review,” “dossier,” “governance,” and generated manuscript codes.
- Mobile navigation and action groups can wrap unpredictably; the floating assistant needs explicit clearance from private mobile controls.
- Empty and error states do not consistently retain the private workspace rhythm.

## Phase 1 response

Use a shared role rail at desktop, a real disclosure menu at mobile, a compact workspace type and spacing system, register-like record rows, and one primary action per workflow. Keep all displayed data tied to existing Supabase records and preserve current server authorization.
