# Public-site integration audit — 2026-09-12

Doer: Rabin Bam (user-reassigned audit). Branch: `rabin-01`. Baseline: `e05a583`, matching fetched `origin/dev` at inspection. Scope: public integration/data-fidelity cleanup, not new backend features or a redesign.

## Routes inspected in code

`/`, `/research`, `/research/[slug]`, `/researchers`, `/researchers/[slug]`, `/projects`, `/projects/[slug]`, `/publications`, `/publications/[slug]`, `/events`, `/opportunities`.

Publication public routing uses **slug**, not `[id]`; private workspaces retain their existing ID routes. Route generation passed the production build. This does not certify live database content, authenticated sessions or every browser link.

## Findings and corrections

- Homepage publication links used IDs and several search scopes were not implemented. Public cards now use slugs; title/name search labels match backend behavior and project status is validated with Zod. Unified search is not claimed.
- Publication detail and metadata did not explicitly restrict status, allowing owners/admins whose RLS permissions are broader than anonymous users to resolve private records at public URLs. Both now use the same published-only query. Existing database RLS and workflow controls remain unchanged.
- Research area detail lacked the complete connected journey. Public researcher/project junctions now supply real connections; published outputs connect via the area's projects. Query failures surface as errors instead of misleading empty lists.
- Researcher pages use the public `researchers` table, never private profiles. Area badges remain visibly DEMO DATA. Removed inferred lead/PI identity and fabricated contact/affiliation facts.
- Project pages use stored title, summary, status, team, areas and published outputs. Removed fictional lifecycle milestones, funding, ethics, compute allocations, recruitment numbers and unsupported artifacts. Get Involved links to a real section explaining that participation submission is not yet connected.
- Removed hard-coded paper/fellow/download metrics, fake DOIs/authors/reviewer ledgers/results, journal volumes/ISSN/indexing and licensing/compliance claims. Real stored DOI is optional; no DOI is invented.
- Events/opportunities had no supporting schema. They are now honest coming-soon states with working project discovery links; no database migration added.
- Homepage retains the editorial palette, serif hierarchy, cards and Discover → Understand → Connect → Participate journey using actual records or explicit empty/setup states.
- Global navigation exposes implemented directories, keeps server-derived account/workspace destinations and sign-out, removes inert notification/bookmark/search shortcuts, and labels mobile navigation. Footer weak destinations say coming soon.
- Responsive code uses wrapping controls, minimum-width guards, shared page shells, labeled inputs, native links/buttons/details, text status labels and visible focus styles. No manual viewport or assistive-technology certification is claimed.

## Files / areas

- All 11 public page route files; `app/layout.tsx` limited to public shell/unsupported claims.
- `components/navigation/site-header.tsx`, `components/shared/site-footer.tsx`, `components/projects/project-card.tsx`, `components/research/search-form.tsx`, `components/research/researcher-card.tsx`.
- `features/research/queries.ts`, new `public-records.ts` and `filters.ts`; `tests/public-discovery.test.ts`.
- This report and only Rabin's section of `docs/project-status.md`.

No changes to admin/dashboard routes, auth authorization, Supabase migrations/types, package dependencies, AI/Qwen system or secrets. No hosted writes, push, merge or Linear changes.

## Verification

- `npm run check`: passed (ESLint and TypeScript).
- `npm test`: passed, 28 tests, 0 failures. Includes existing PostgreSQL/PGlite role/workflow tests and four new public-boundary, area-connection, error-handling and input-validation tests.
- `npm run build`: passed using default Turbopack; all routes generated. No webpack fallback needed.
- `git diff --check`: passed. Changed TypeScript files formatted with the existing Prettier installation.
- Privacy tests deliberately use a mock transport without RLS to prove the public query itself excludes private workflow states. These complement, but do not replace, hosted Auth/RLS acceptance.

## Remaining work and safest next action

1. Naitik/Sambhav: review this branch, then manually verify the seeded journey at 375px, tablet and desktop, keyboard navigation, empty/error/not-found states and no horizontal overflow. The shortened time budget prevented browser/hosted verification; full audit acceptance remains pending.
2. Millind: integrate the existing interest backend into WEB-13 Get Involved UI, plus his admin/dashboard acceptance work. This pass does not implement participation or change his dashboard architecture.
3. Rabin/Naitik: recheck current hosted migration/type state and run anonymous/student/researcher/admin acceptance for WEB-5/WEB-11/WEB-12. Earlier status entries are historical evidence, not a fresh claim about the hosted database.
4. Naitik: after review and hosted acceptance, resume WEB-6 connected search as a separate coordinated task. Current lists are bounded (50 projects/publications, 100 areas/researchers), with honest count labels; pagination/unified ranking are not implemented.
5. Rabin: continue the separately owned AI/Qwen integration only after this public handoff; no AI readiness verification was performed here.

The safest immediate next task is review plus browser/hosted verification, not additional features or uncoordinated migrations.
