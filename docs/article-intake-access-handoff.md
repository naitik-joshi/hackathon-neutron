# Researcher access and article intake handoff

This coordinated follow-up is implemented on `rabin-03`. It has no supplied Linear ID. It does not change Qwen, public search, or public publication-page presentation.

## User flow

Public registration lets a person choose student or researcher intent, but every new Auth profile is still created as a student. Researcher intent never grants a role. A signed-in student can submit a researcher-access request from `/account`. The request records contact and affiliation details but never stores a password. It remains private to that user and administrators. An admin reviews it at `/admin/access`; approval atomically records the decision and promotes the profile to researcher.

A researcher starts a publication at `/researcher/publications/new` by uploading a completed `.docx` or text-based `.pdf` using the institutional article template. `POST /api/publications/extract` validates the authenticated researcher, file type and 10 MB limit, then returns extracted editable fields. Only title and abstract are required. `POST /api/publications/submit` repeats authorization and validation, verifies the document contents, uploads it to the private `ResearchFileData` bucket with its correct extension and MIME type, and inserts the submitted publication with validated metadata. A failed database insert attempts to remove the unreferenced object. Image-only scanned PDFs return `This PDF does not contain enough extractable text.` and are not submitted.

PDF.js is externalized from the Next.js server bundle in `next.config.ts` so its worker remains resolvable from `node_modules`. This fixes the development-runtime failure that previously surfaced as the generic “could not be read” message even for a valid text-based PDF. PDF extraction remains intentionally best-effort: every detected field is an editable starting point, and no OCR or guaranteed bibliography/section recovery is claimed.

Both API routes return JSON with `error` on failure. Expected statuses are 400 for a missing/invalid form, 401 for no session, 403 for the wrong role, 413 for size limits, 422 for invalid fields or a malformed/uncompleted template, 503 for unavailable configuration/storage, and 201 for a successful submission.

Submission Readiness receives the references already extracted and edited in the intake form, so the researcher does not paste a second copy. Reference text remains ephemeral to the readiness request and is not persisted as a separate record.

`/admin/access` can also invite a new administrator through Supabase Auth or explicitly promote an existing account when the optional server-only `SUPABASE_SERVICE_ROLE_KEY` is configured. The server checks the current application role before using the Admin API, validates email/display name, requires confirmation for existing-account promotion, and never accepts or exposes a password. Without that key, the page says invitations are unavailable and retains existing profile-role controls.

## Hosted Supabase status

Migration `202609130001_researcher_access_document_intake.sql` was applied to the linked hosted project on 2026-09-13 and confirmed in hosted migration history. It is now shared and immutable; any follow-up database change must use a new timestamped migration.

Before application testing, confirm that the existing bucket ID is exactly `ResearchFileData`. The migration explicitly keeps it private, limits uploads to 10 MB DOCX/PDF files, and adds owner-researcher/admin object policies when the Supabase Storage schema is present. It does not create, rename, empty, or publicly expose the bucket. Published publication metadata remains public, but source files do not become anonymous downloads.

## Hosted acceptance

1. Register a new account and confirm its `profiles.role` is `student` regardless of browser input or Auth metadata.
2. Submit one researcher request. Confirm another student and an anonymous request cannot read it, spoof its owner, approve it, or create a duplicate pending request.
3. Approve it as admin. Confirm the request records reviewer/time and the profile becomes `researcher` in the same operation.
4. Confirm an admin cannot change their own role, while they can manage the role of another existing account.
5. Upload one completed article-template DOCX and one text-based PDF. Confirm extraction fills available fields and optional blanks remain editable. Confirm a malformed or image-only PDF is rejected.
6. Submit it. Confirm the object path begins with the researcher's UUID, the publication is `submitted`, and neither the row nor object is publicly readable before publication.
7. Publish through the existing review workflow. Confirm normal publication information remains public without login while the source document remains unavailable anonymously.
8. Regenerate hosted database types and compare them with `lib/supabase/database.types.ts`.

Local checks passed: lint, TypeScript, all 64 tests, and the webpack production build. Hosted anonymous checks denied a zero-item bucket listing and public-object HEAD request, exposed no researcher-access rows, and preserved public published-metadata reads. Authenticated owner/other-researcher/admin Storage checks plus real DOCX/PDF submissions and access approval remain pending because disposable demo sessions were unavailable in this run.
