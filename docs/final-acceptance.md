# Final acceptance record — 2026-09-13

## Passed

- Connected `/search` returns grouped public areas, researchers, projects and published publications. The seeded term **Artificial Intelligence** returned all four groups through the running Next.js app.
- Hosted demo seed applied successfully and is repeatable/non-destructive by automated PostgreSQL tests.
- Qwen EC2 and Ollama services are active. Same-origin health, papers, positive query, exact hard-negative, deterministic recommendation and positive comparison passed. Eight documents are indexed; PDF titles now use article titles instead of journal mastheads.
- Browser code calls only `/api/research-assistant/*`; backend URL and API key remain server-only. Paper-list responses are validated and the UI cannot report ready when the paper index is unavailable.
- Automated lint, TypeScript, RLS/workflow, document parser, search and Qwen contract checks pass. See the final PR report for exact totals and build result.
- Follow-up assistant-control fix: isolated headless Edge tests passed visible/uncovered Analyze and Compare controls, ten form submissions and Escape at 375x667, 375x380, 768x1024, 1024x768 and 1440x900. Responses were mocked with clearly labelled demo data; this does not replace hosted Qwen or authenticated acceptance. Lint, TypeScript, 72 application tests and webpack build passed again.

## Not accepted in this run

- Authenticated hosted journeys need disposable student, researcher and admin credentials. None were available in local QA environment variables.
- Admin invitation needs the optional server-only `SUPABASE_SERVICE_ROLE_KEY`; it was not configured, so no live invitation was sent.
- Native browser automation was unavailable because its control transport was closed. HTTP route smoke tests passed, but full 375/768/1024/1440 visual and keyboard acceptance must be repeated manually.
- Qwen’s EC2 transport is plain HTTP demo infrastructure. Production requires trusted HTTPS/private networking and restricted direct port access.

Do not mark WEB-16 complete until the missing authenticated and browser acceptance journeys pass.
