# Testing and acceptance evidence

## Automated checks

Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. CI runs these on pushes and PRs using Node 22, without live credentials. PGlite is a Docker-free embedded PostgreSQL runtime used only in tests; it needs no Supabase service or credentials. The application uses hosted Supabase PostgreSQL. Tests install a minimal auth.users/auth.uid contract, then execute the actual migration and seed unchanged with anon/authenticated roles. They do not emulate the Supabase HTTP API, cookies, refresh tokens or Auth service.

Automated coverage includes demo-seed idempotency and non-demo preservation; signup intent without role elevation; anonymous reads/writes; researcher/admin access transitions; private file and publication ownership; review/resubmission/publishing; connected-search ranking and unpublished exclusion; DOCX/PDF extraction failures; and Qwen request, hard-negative, availability and response contracts.

## Browser / local production smoke

With no credentials: homepage returns HTTP 200 and renders an honest setup state. Browser navigation to /researcher and /admin/submissions reaches /auth/sign-in?message=setup with no private content. Next streaming can deliver a redirect in the response body after HTTP 200; test the final browser URL rather than relying only on HEAD status. Desktop and 375px mobile homepage visually inspected; document scroll width equalled viewport width (375px), with no horizontal overflow. These checks do not substitute for signed-in integration testing.

## Hosted acceptance status

The linked hosted schema and private bucket policies are present. The final public demo seed was applied on 2026-09-13, and `/search?q=Artificial%20Intelligence` returned all four public entity groups. Qwen’s five same-origin routes passed live health, papers, query, recommend and compare checks. Authenticated role journeys below remain pending because disposable QA credentials were not available during the final hardening run.

## Required authenticated acceptance

1. Follow the hosted-only workflow: `npm ci` → configure `.env.local` → `npx supabase link --project-ref YOUR_PROJECT_REF` when needed → `npx supabase db push` for coordinated migrations → `npm run dev`. Authenticate the CLI if needed and confirm the target project before pushing. Apply supabase/seed.sql in the hosted development project's SQL editor. Provision confirmed researcher, admin and optional student accounts as described in README.
2. Use separate browser profiles/private sessions for anonymous, researcher and admin. Keep credentials out of screenshots.
3. Anonymous: browse `/search?q=Artificial%20Intelligence`, `/research/demo-artificial-intelligence`, `/projects/demo-edge-ai-crop-monitoring`, and a demo publication. Confirm `DEMO DATA` in every fictional preview/detail. Confirm `/researcher` and `/admin` redirect to sign-in.
4. Public signup: create a student account through `/auth/sign-up`. Confirm there is no role control. With email confirmation enabled, confirm the page tells the user to verify and does not claim a session; without it, confirm the new session lands on `/account`. Confirm the profile role is `student` even if a direct Auth request attempts privileged metadata.
5. Researcher: sign in and confirm `/researcher`. Submit a title and abstract, leave DOI/year blank, and mark fictional content as DEMO DATA. Confirm feedback and Submitted status under `/researcher/publications`. Record its ID/slug for test evidence.
6. Anonymous: the new slug must return not-found; its row and relationship records must not appear through the Data API. Student/other researcher cannot read it. Researcher cannot reach admin routes.
7. Researcher: attempt a direct authenticated Data API UPDATE to published and a direct INSERT with published status. Both must leave the database unpublished (RLS updates may return zero affected rows rather than an error). Attempt another owner's ID, a submitted-content edit and a profile role change. Confirm no unauthorized changes.
8. Admin: sign in → `/admin/submissions` → detail → Start review. Refresh and confirm Under Review. Request changes with a note. Confirm a blank note is rejected, the owner can read the note, and no other researcher can read it.
9. Researcher: open the private publication detail, confirm review history shows the note as plain text with a neutral reviewer label, edit the record, and resubmit. Confirm the status returns to Submitted and editing locks.
10. Admin: start review again, then approve and publish. Confirm Published, non-null `published_at`, and a working public link. A stale second decision must show feedback without overwriting state.
11. Anonymous: reload `/publications`, search by the new title and open the new detail URL. It is immediately visible. Check optional DOI navigation with a separate valid DOI submission.
12. Admin: test Reject with a required note on a separate submitted example. Sign out of all accounts and confirm guarded routes no longer render private content.
13. Verify expired-session refresh, invalid-password feedback, wrong-role redirect, keyboard submit, pending feedback, 375px/tablet/desktop layout and refresh after mutations. Record project/date/commit/results without passwords in the handoff.

## Limits

Full hosted Supabase Auth/cookie and Data API acceptance remains pending until the checklist is actually verified against the configured hosted project. Passing PGlite tests does not complete hosted acceptance. Do not mark the hosted acceptance issue complete until these checks pass. Add meaningful tests whenever authorization or workflow behavior changes.
