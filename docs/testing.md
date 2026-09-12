# Testing and acceptance evidence

## Automated checks

Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. CI runs these on pushes and PRs using Node 22, without live credentials. PGlite is a Docker-free embedded PostgreSQL runtime used only in tests; it needs no Supabase service or credentials. The application uses hosted Supabase PostgreSQL. Tests install a minimal auth.users/auth.uid contract, then execute the actual migration and seed unchanged with anon/authenticated roles. They do not emulate the Supabase HTTP API, cookies, refresh tokens or Auth service.

Automated coverage includes seed idempotency; metadata cannot elevate role; anonymous reads/writes; student cannot submit or promote; researcher ownership, locked submitted edits and inability to publish; private relationship visibility; admin review transitions and required notes; change-request resubmission; publication timestamps; immediate anonymous visibility; and RLS on every exposed table. Zod tests cover publication fields, review decisions, participation input, signup email/password confirmation, and rejection of role fields from public auth input.

## Browser / local production smoke

With no credentials: homepage returns HTTP 200 and renders an honest setup state. Browser navigation to /researcher and /admin/submissions reaches /auth/sign-in?message=setup with no private content. Next streaming can deliver a redirect in the response body after HTTP 200; test the final browser URL rather than relying only on HEAD status. Desktop and 375px mobile homepage visually inspected; document scroll width equalled viewport width (375px), with no horizontal overflow. These checks do not substitute for signed-in integration testing.

## Required hosted Supabase acceptance (pending verification)

1. Follow the hosted-only workflow: `npm ci` → configure `.env.local` → `npx supabase link --project-ref YOUR_PROJECT_REF` when needed → `npx supabase db push` for coordinated migrations → `npm run dev`. Authenticate the CLI if needed and confirm the target project before pushing. Apply supabase/seed.sql in the hosted development project's SQL editor. Provision confirmed researcher, admin and optional student accounts as described in README.
2. Use separate browser profiles/private sessions for anonymous, researcher and admin. Keep credentials out of screenshots.
3. Anonymous: browse /research, /research/demo-artificial-intelligence, /publications and /publications/demo-accessible-learning-publication. Confirm DEMO DATA in every fictional entity preview/detail. Confirm /researcher and /admin redirect to sign-in.
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
