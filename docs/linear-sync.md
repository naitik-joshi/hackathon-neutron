# Linear synchronization

Synchronized directly on 2026-09-12 to [Islington R&D Digital Hub — Hackathon 2026](https://linear.app/web-dev-2026/project/islington-randd-digital-hub-hackathon-2026-9dd9e3a41481) in Team Neutron. No named assignees were set. Project ID: 0219a1e7-55da-4a2e-92a3-08294b13f985.

## Milestones

- Foundation Alive
- Discovery Works
- Participation Works
- Research Operations Works
- Demo Ready

## Issues and branches

| Local key | Linear issue                                                                                                | Suggested branch                         | Blocked by                  |
| --------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------- |
| F01       | [WEB-5](https://linear.app/web-dev-2026/issue/WEB-5/verify-the-hosted-supabase-publication-journey)         | `feat/WEB-5-verify-supabase-journey`     | None                        |
| D01       | [WEB-6](https://linear.app/web-dev-2026/issue/WEB-6/add-connected-search-across-research-entities)          | `feat/WEB-6-connected-search`            | WEB-5                       |
| D02       | [WEB-7](https://linear.app/web-dev-2026/issue/WEB-7/connect-research-area-pages-to-people-and-publications) | `feat/WEB-7-area-connections`            | WEB-5                       |
| D03       | [WEB-8](https://linear.app/web-dev-2026/issue/WEB-8/create-public-researcher-detail-pages)                  | `feat/WEB-8-researcher-pages`            | WEB-5                       |
| D04       | [WEB-9](https://linear.app/web-dev-2026/issue/WEB-9/create-public-project-detail-pages)                     | `feat/WEB-9-project-pages`               | WEB-5                       |
| W01       | [WEB-10](https://linear.app/web-dev-2026/issue/WEB-10/add-researcher-edit-and-resubmit-screens)             | `feat/WEB-10-resubmit-publication`       | WEB-5                       |
| W02       | [WEB-11](https://linear.app/web-dev-2026/issue/WEB-11/add-review-feedback-and-reviewer-attribution)         | `feat/WEB-11-review-feedback`            | WEB-5                       |
| P01       | [WEB-12](https://linear.app/web-dev-2026/issue/WEB-12/create-expression-of-interest-database-and-action)    | `feat/WEB-12-interest-backend`           | WEB-5                       |
| P02       | [WEB-13](https://linear.app/web-dev-2026/issue/WEB-13/build-get-involved-entry-and-interest-form)           | `feat/WEB-13-get-involved`               | WEB-12, WEB-9               |
| W03       | [WEB-14](https://linear.app/web-dev-2026/issue/WEB-14/show-role-relevant-dashboard-next-actions)            | `feat/WEB-14-dashboard-next-actions`     | WEB-10, WEB-11              |
| Q01       | [WEB-15](https://linear.app/web-dev-2026/issue/WEB-15/audit-responsive-and-keyboard-journeys)               | `feat/WEB-15-responsive-audit`           | WEB-7, WEB-8, WEB-9, WEB-14 |
| Q02       | [WEB-16](https://linear.app/web-dev-2026/issue/WEB-16/rehearse-and-record-the-demo-acceptance-journey)      | `feat/WEB-16-demo-rehearsal`             | WEB-15, WEB-13              |
| O01       | [WEB-17](https://linear.app/web-dev-2026/issue/WEB-17/add-needs-attention-and-freshness-queries)            | `feat/WEB-17-needs-attention`            | WEB-5                       |
| O02       | [WEB-18](https://linear.app/web-dev-2026/issue/WEB-18/create-a-minimal-event-management-slice)              | `feat/WEB-18-event-slice`                | WEB-5                       |
| O03       | [WEB-19](https://linear.app/web-dev-2026/issue/WEB-19/create-a-minimal-opportunity-management-slice)        | `feat/WEB-19-opportunity-slice`          | WEB-5                       |
| O04       | [WEB-20](https://linear.app/web-dev-2026/issue/WEB-20/prototype-grant-directory-schema-and-read-view)       | `feat/WEB-20-grant-directory`            | WEB-5                       |
| O05       | [WEB-21](https://linear.app/web-dev-2026/issue/WEB-21/add-in-app-review-notifications)                      | `feat/WEB-21-review-notifications`       | WEB-11                      |
| O06       | [WEB-22](https://linear.app/web-dev-2026/issue/WEB-22/add-basic-admin-counts-from-real-records)             | `feat/WEB-22-admin-counts`               | WEB-5                       |
| O07       | [WEB-23](https://linear.app/web-dev-2026/issue/WEB-23/define-researcher-profile-update-review-flow)         | `feat/WEB-23-profile-review`             | WEB-11                      |
| S01       | [WEB-24](https://linear.app/web-dev-2026/issue/WEB-24/evaluate-semantic-search-with-a-public-only-dataset)  | `feat/WEB-24-semantic-search-spike`      | WEB-6, WEB-16               |
| S02       | [WEB-25](https://linear.app/web-dev-2026/issue/WEB-25/design-a-cited-public-research-assistant)             | `feat/WEB-25-assistant-spike`            | WEB-16                      |
| S03       | [WEB-26](https://linear.app/web-dev-2026/issue/WEB-26/evaluate-admin-recommendations-and-personalization)   | `feat/WEB-26-recommendations-spike`      | WEB-17, WEB-16              |
| S04       | [WEB-27](https://linear.app/web-dev-2026/issue/WEB-27/scope-partners-and-richer-integrations)               | `feat/WEB-27-partner-integrations-spike` | WEB-16                      |

All 23 issues were created with milestone, priority, scope, acceptance criteria, suggested owner role, 30–90 minute estimate and blocker relationships. WEB-5 is Urgent because hosted verification is outstanding. Other P0 issues are High; P1 Medium; P2 Low. Bootstrap itself is recorded in Git, not falsely represented as fully hosted-tested.

Branch convention: feat/<issue-id>-short-name, fix/<issue-id>-short-name, chore/<issue-id>-short-name. PR title: <issue-id>: Description. GitHub/Linear linking can be enabled in workspace integration settings; it was not configured here. See linear-backlog.json for machine-readable scope and stable local dependency keys.
