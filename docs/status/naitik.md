# Naitik — WEB-29 Pass 1 public UI foundation

**Branch:** `feat/WEB-29-ui-foundation`

**Status:** Local implementation and browser QA complete; hosted acceptance pending.

## Work completed

- Repaired the project-interest path so it invokes the real server action and never reports simulated success. Guest and non-student states now show honest access guidance without a disabled fake form.
- Added strict, tested internal return-path handling for sign-in and sign-up. Admin and researcher post-authentication destinations remain server-derived and cannot be overridden by a public redirect.
- Added independent homepage data loading, a publication-title-only search entry, and an editorial homepage hierarchy built entirely from public database records.
- Established semantic brand, surface, typography, state, focus, radius, shadow and motion tokens; rebuilt shared buttons, fields, messages and route states on those tokens.
- Added the tracked IJMR mark under `public/brand/`, a server-rendered role-aware header with a small interactive navigation island, keyboard/Escape mobile behavior, and a footer with verified IJMR links.
- Rebuilt sign-in, student-only sign-up and forbidden recovery around the existing Supabase actions. Added accessible password reveal controls and explicit institution-provisioned researcher/admin guidance.
- Kept role resolution, authorization, writes and published-data filtering on the existing server/database boundaries. No schema, migration, admin, researcher or Qwen code was changed.

## Files and boundaries

- Shared changes are concentrated in `app/globals.css`, the root layout, `components/ui/`, the public header/footer/brand components and global route states.
- Feature changes are limited to public homepage composition, project participation wiring, authentication pages/forms/actions, and small reusable redirect/loading helpers.
- The user-provided `assets/` directory was left untouched and is not part of this branch.

## Verification

- `npm run check` passed (ESLint and TypeScript).
- `npm test` passed: 40/40 tests.
- Default `npm run build` hit the known agent-environment Turbopack worker-port restriction after local font fetching had already been removed.
- `npm run build -- --webpack` passed and generated all application routes.
- Browser QA covered the homepage, sign-in, sign-up, forbidden recovery and a project participation boundary at 375px, 768px, 1024px and 1440px. The mobile menu opens, closes with Escape and restores the trigger state; password reveal updates its label and input type.
- Browser console hydration messages were traced to installed extensions injecting `bis_skin_checked` and a generated `__processed_*` body attribute, rather than application markup.
- Hosted Supabase registration, post-auth redirects and a real student interest write remain pending. No hosted schema was mutated.

## Next

- Review and merge WEB-29 Pass 1, then smoke-test student registration, confirmation behavior, role routing and one project-interest write against hosted Supabase.
- Continue WEB-29 with public directory/detail phases on a new coordinated branch; keep WEB-6 connected search and Qwen UI integration separately scoped.
