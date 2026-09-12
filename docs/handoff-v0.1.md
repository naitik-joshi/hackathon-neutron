# v0.1 handoff

## What works

Small Next.js foundation with a PostgreSQL-backed public → researcher submission → admin review/publish → public path. Zod validation, Supabase SSR utilities, session refresh proxy, server role guards, RLS, workflow triggers, typed schema contract, DEMO DATA seed, shared UI, responsive layouts, CI and collaboration docs. Database lifecycle/security tests pass. Build succeeds without credentials using setup states. Full hosted authentication acceptance is still pending; do not represent it as verified.

## Routes implemented

Public: `/`, `/research`, `/research/[slug]`, `/projects`, `/projects/[slug]`, `/publications`, `/publications/[slug]`. Auth/account: `/auth/sign-in`, `/auth/sign-up`, `/auth/forbidden`, `/account`. Researcher: `/researcher`, `/researcher/publications`, `/researcher/publications/new`, `/researcher/publications/[id]`. Admin: `/admin`, `/admin/submissions`, `/admin/submissions/[id]`. Loading/error/not-found states are shared. Admin overview contains nonfunctional labelled extension cards for Needs Attention, analytics, projects, researchers, events and opportunities.

## Database tables

Migration: supabase/migrations/202609120001_initial_research.sql. Tables: profiles, research_areas, researchers, projects, publications, researcher_research_areas, researcher_projects, project_research_areas, publication_researchers, publication_projects. See data-model.md for relationships, indexes, lifecycle and deletion behavior. supabase/config.toml is retained CLI configuration; hosted Auth settings must be configured separately in the dashboard; supabase/seed.sql is idempotent demonstration content.

## Auth roles and RLS policies

Student: public discovery and private own profile only. Researcher: public discovery plus own submissions; insert Draft/Submitted, edit own Draft/Changes Requested only. Admin: institutional management/review/publishing. New users always start as student. Trusted SQL provisions roles, never user metadata. Directory entities are public/admin-curated. Publication relationships inherit publication visibility. Profiles are private to owner/admin. Database enforces permitted transitions, immutable attribution and publishing timestamp. Researchers have no Publish control or database permission. Approval and publishing are one explicit action from Under Review; no separate Approved status exists.

## Environment, seed and accounts

Follow the README hosted-only setup: `npm ci` → configure `.env.local` → `npx supabase link --project-ref YOUR_PROJECT_REF` when needed → `npx supabase db push` for coordinated migrations → `npm run dev`. Authenticate the CLI with `npx supabase login` if needed before linking. Required values: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY from the hosted development project in ignored .env.local. No service-role key. Confirm the linked project and coordinate with the database owner before pushing migrations. Run supabase/seed.sql in the hosted development project's SQL editor. Create confirmed researcher/admin accounts through hosted Supabase Auth and promote their actual UUIDs in profiles using trusted SQL. Optional student keeps its default role. Exact SQL and commands are in README; verification steps are in testing.md.

## Known limitations

Hosted Auth/cookie/Data API end-to-end acceptance remains pending until verified against the configured hosted project. Docker-free PGlite PostgreSQL tests verify actual SQL/RLS but not Auth transport. Student email/password signup, researcher edit/resubmit, private review history, and admin review notes are wired. Password reset, OAuth, notification delivery, rich connected search, public researcher pages, full Express Interest UI, and a full CMS remain outside this slice. Admin extension cards are deliberately shells. Directory records have no private/draft state. Database types are an explicit v0.1 contract; compare them with generated hosted types after connecting.

## Hot files

Coordinate package.json, package-lock.json, app/layout.tsx, app/globals.css/design tokens, proxy.ts, lib/supabase/* and shared database types. Migrations require explicit coordination. No unrelated redesigns, broad reformatting or dependency churn.

## Safe parallel development and first tasks

A — Backend/Integration: establish the development database with B; then connected search queries in features/research/.
B — Backend/Auth: run the live Supabase acceptance matrix first; then add edit/resubmit and permission tests in features/publications/.
C — Public UI/UX: enrich area connections and add researcher/project pages under app/(public)/ using existing primitives.
D — Dashboard UI/UX: coordinate review feedback fields with B, then add role-specific next actions under app/researcher/ and app/admin/.
Agree migration ownership before starting cross-cutting tasks. Use the actual Linear IDs/branches in linear-sync.md. Fifteen-minute blocker rule; two-hour integration checkpoints; feature freeze at hour 20.

## Linear status

Synchronized directly to Team Neutron: project Islington R&D Digital Hub — Hackathon 2026. Five milestones and bounded P0/P1/P2 issues, with dependencies and no named assignees. See linear-sync.md for identifiers, branch names and links. linear-backlog.md/json remain the portable source manifest.

## Validation

Lint/typecheck/build and 11 automated tests pass. Desktop/375px mobile homepage (no horizontal overflow) and missing-configuration researcher/admin redirects inspected in a real browser. Remaining live checks are explicitly tracked in testing.md and Linear F01. Check the final commit's CI before merging.
