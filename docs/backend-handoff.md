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

2026-09-12 verification: lint, typecheck, all 17 tests, and production build passed. A read-only hosted probe using the saved publishable configuration reached projects successfully (0 public rows); both new tables returned PGRST205, confirming they are not available in the hosted API yet. No hosted schema changes were applied by this task.

Backend delivery branch: `rabin`. Required checks passed again before commit. Hosted deployment is blocked by missing Supabase CLI authentication (`LegacyPlatformAuthRequiredError`). Run `npx supabase login` locally, then link the intended team development project and inspect pending migrations before `npx supabase db push`. The publishable app key cannot apply schema migrations. Hosted type generation/comparison and signed-in acceptance remain outstanding.
