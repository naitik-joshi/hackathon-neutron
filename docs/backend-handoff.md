# WEB-11 / WEB-12 backend handoff

Migration/type ownership was explicitly approved by the user for Rabin on 2026-09-12. These additive migrations must be applied in filename order after the initial migration. Existing shared SQL was not rewritten.

## Review feedback

`reviewPublication` accepts `id`, `decision`, and `note` FormData fields. Changes Requested and Rejected require a trimmed note of 3–4000 characters. Start review and Publish allow an empty note. The frontend owner must supply the note input; the earlier local review-form edit is excluded from this backend-only commit. Until that integration lands, the existing form cannot request changes or reject because it supplies no note.

`review_publication` is a SECURITY INVOKER database function with a fixed empty search_path and authenticated-only execute permission. It checks the admin role, updates only the expected state, and inserts feedback within the same transaction. Invalid notes or stale states roll back the whole operation. Reviewer identity comes from auth.uid(), not form input.

Review history is in `publication_reviews`, never in the publicly readable publication row. Only admins and the publication submitter can read it, including after publication. Researchers cannot insert, update, or delete feedback. History is append-only for application users. Existing direct admin publication updates remain available; use the RPC for decisions that must record feedback.

Frontend handoff: `getPublicationReviews(publicationId)` in `features/submissions/queries.ts` returns the latest 100 private review records for a guarded researcher/admin view. Connect it to the researcher publication screen; render notes as plain text. Reviewer UUID is returned without exposing private profile data. Display a fallback when reviewer_id is null. Dashboard route edits remain with the frontend owner.

## Expression of interest

`expressInterest` accepts `project_id`, `contact_email`, `message`, `is_demo` (checkbox `on`). Only authenticated students can submit. The action reads student identity from the server profile. Message length is 20–2000; email is normalized and validated. A unique (project_id, student_id) constraint prevents duplicates, including races. Repeated submission returns an already-saved success message and does not overwrite contact context.

`getMyInterests()` returns at most 100 of the caller's private records; `getInterestInbox()` requires admin. Records have no public read access, including to other researchers. No update/delete UI or notification delivery is included. The contact email is user-provided contact context, not verified account ownership. Fictional interest records must set is_demo and be rendered with DEMO DATA by WEB-13 UI. Public project browsing still requires no login.

## Deletion and visibility

Deleting a publication cascades its review history. Deleting a reviewer profile sets reviewer_id to NULL while preserving notes. Deleting an interest owner profile or project cascades its interests. Public directory tables and publication visibility are unchanged. All 12 exposed tables have RLS after both migrations.

## Deployment and verification

Apply coordinated migrations to the team's hosted development project, then compare generated Supabase types with the explicit checked-in schema contract. Local PGlite tests execute all migrations and exercise review rollback, stale decisions, role restrictions, privacy after publication, deduplication, validation constraints and deletion behavior. Hosted Auth/cookie/Data API acceptance and generated hosted-type comparison remain pending until run against the configured project. Frontend feedback rendering and WEB-13 integration remain handoff work.

2026-09-12 verification: lint, typecheck, all 17 tests, and production build passed. A read-only hosted dashboard check showed only the original 10 tables and four original functions. Direct Data API checks returned PGRST205 for `publication_reviews` and `project_interests`, and PGRST202 for `review_publication`. The backend objects therefore do not exist in the hosted team project yet. No hosted schema changes were applied by this task.

Backend delivery branch: `rabin`. Required checks passed again before commit. Hosted deployment is blocked by missing Supabase CLI authentication (`LegacyPlatformAuthRequiredError`). Run `npx supabase login` locally, then link the intended team development project and inspect pending migrations before `npx supabase db push`. The publishable app key cannot apply schema migrations. Hosted type generation/comparison and signed-in acceptance remain outstanding.

### Explicit backend next steps

1. Get confirmation from Naitik, the shared database owner, that `mgjplkvuldnvbpqmrpgb` is the correct development project and that no teammate is deploying migrations concurrently.
2. Authenticate the Supabase CLI with `npx supabase login` and link with `npx supabase link --project-ref mgjplkvuldnvbpqmrpgb`.
3. Inspect the linked migration state. Apply the approved additive migrations in filename order with `npx supabase db push`: `202609120002_review_feedback.sql`, then `202609120003_project_interests.sql`. Do not edit a migration after it has been shared.
4. Confirm the hosted project now exposes both tables and exposes `review_publication` to authenticated users only. Confirm RLS is enabled and anonymous reads reveal no private records.
5. Generate hosted Supabase types and compare them with `lib/supabase/database.types.ts`; coordinate any shared-type correction with Naitik.
6. Run the WEB-5 hosted acceptance matrix: admin review with feedback; researcher reads only their own feedback; student creates one interest; duplicate stays single; anonymous, wrong-role, spoofed-owner and other-user access fails; normal public research remains readable without login.
7. Record the hosted results in Rabin's section of `docs/project-status.md` and Linear. Only then mark WEB-11/WEB-12 ready for integration.

Frontend work is a dependency, not part of this backend follow-up: WEB-10 must wire edit/resubmit, WEB-11 must render private feedback and collect review notes, WEB-13 must wire the interest form, and WEB-14 may surface private role-relevant next actions.
