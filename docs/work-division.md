# Work Division — Islington R&D Digital Hub

This document defines the primary ownership areas for the four-person hackathon team. Ownership is meant to reduce merge conflicts and confusion, not to stop members from helping each other.

## Team

### Naitik Joshi — Backend & Integration Primary

Primary responsibilities:
- Hosted Supabase setup and live environment verification
- Database and integration coordination
- Connected search/data-query integration
- Cross-feature integration into `dev`
- PR review, merge coordination, smoke testing and build health
- Coordinate all shared/hot-file changes

Initial Linear focus:
- WEB-5 — Verify the hosted Supabase publication journey
- WEB-6 — Add connected search across research entities
- Later: WEB-17 and integration-heavy work as time allows

Default ownership:
- `features/research/**` for backend/query integration work
- integration changes across feature boundaries
- coordinated database/type changes
- final merge/integration checks

Avoid taking over frontend-owned feature files unless requested. Integration ownership does not mean rewriting teammates' work.

---

### Rabin Bam — Backend Primary

Primary responsibilities:
- Researcher and admin workflow logic
- Authentication/authorization behavior
- Publication lifecycle improvements
- Expression-of-interest backend
- RLS/workflow tests
- Backend support for later events/opportunities

Initial Linear focus:
- WEB-10 — Add researcher edit and resubmit screens/backend behavior
- WEB-11 — Add review feedback and reviewer attribution
- WEB-12 — Create expression-of-interest database and action

Default ownership:
- `features/publications/**`
- `features/submissions/**`
- auth/workflow logic related to assigned issues
- relevant tests

Database migrations, shared database types and Supabase core utilities MUST be coordinated with Naitik before editing.

---

### Sambhav Shrestha — Frontend Primary: Public Discovery

Primary responsibilities:
- Public research discovery experience
- Research-area pages
- Researcher public profiles
- Project detail pages
- Reusable public-facing cards/components
- Responsive public UX

Initial Linear focus:
- WEB-7 — Connect research area pages to people and publications
- WEB-8 — Create public researcher detail pages
- Later: help with public discovery polish after those are integrated

Default ownership:
- `app/(public)/**` for assigned public routes
- `components/research/**`
- new feature-specific public UI components

Do not change database migrations, auth internals, Supabase utilities or backend workflow files unless coordinated.

---

### Millind Shakya — Frontend Primary: Dashboards & Participation

Primary responsibilities:
- Public project detail experience as the first independent frontend slice
- Researcher/admin dashboard UX
- Role-relevant next actions
- Forms and workflow presentation
- Participation/Get Involved UI
- Responsive dashboard UX and later polish

Initial Linear focus:
- WEB-9 — Create public project detail pages
- WEB-14 — Show role-relevant dashboard next actions
- WEB-13 — Build Get Involved entry and interest form after WEB-12 / WEB-9 are ready
- Later: WEB-15 responsive and keyboard audit

Default ownership:
- assigned project/public UI routes for WEB-9
- `app/researcher/**`
- `app/admin/**` for assigned UI work
- new dashboard/participation UI components

Coordinate with Rabin before changing workflow actions or backend validation. Do not modify database migrations or Supabase core files without explicit coordination.

---

## Shared / Hot Files

The following files or areas require explicit coordination before editing:

- `package.json`
- `package-lock.json`
- `app/layout.tsx`
- `app/globals.css`
- `proxy.ts`
- `lib/supabase/**`
- shared database types
- `supabase/migrations/**`
- shared design tokens / global UI primitives
- `AGENTS.md`
- architecture/data-model decisions

Only one person should own a shared-file change at a time.

## Branch / PR Rules

- Branch from the current `dev`.
- Use the real Linear issue ID:
  - `feat/WEB-123-short-name`
  - `fix/WEB-123-short-name`
  - `chore/WEB-123-short-name`
- PR title: `WEB-123: Description`
- Do not merge your own PR without at least one teammate checking it when time allows.
- Do not force-push shared branches.
- Do not perform broad formatting/refactors during feature work.
- `main` remains stable; `dev` is the integration branch.

## Coordination Rules

- Raise a blocker after about 15 minutes instead of silently burning time.
- Sync as a team roughly every 2 hours.
- Announce schema, API-contract, role/permission or shared-component changes immediately.
- Prefer 30–90 minute tasks.
- A task is not complete because an AI agent says it is complete. It is complete after checks pass and the integrated behavior works.
- Every member should update their own section in `docs/project-status.md` after completing or handing off a meaningful task.
