# Final build plan

This is the authoritative remaining-work plan for the Islington College R&D Digital Hub. Work proceeds in order. Later phases remain out of scope until the current phase meets its exit criteria.

## Phase 1 — Authenticated UI rescue and acceptance

**Issues:** WEB-30 + WEB-15
**Status:** BLOCKED

### Goals

- Rebuild the shared authenticated workspace shell.
- Fix private-page margins, content widths, mobile navigation, typography, and rhythm.
- Redesign the student account around identity, discovery, and real project participation.
- Redesign the researcher overview, publication list, detail, and submission form while preserving the existing workflow.
- Redesign the admin overview, submission queue, submission detail, and project-interest inbox while preserving operational rules.
- Polish private loading, error, empty, and forbidden states.
- Browser-test real student, researcher, and admin accounts.
- Verify the real project-interest flow.
- Complete responsive and keyboard acceptance.

### Exit criteria

Every authenticated route is presentable during the demo at 375px, 768px, 1024px, and 1440px. Authentication, publication review, project participation, and role authorization still use the existing server and database contracts. Keyboard navigation, visible focus, mobile layout, and assistant placement pass browser acceptance.

### Acceptance record

Implementation is complete, but Phase 1 remains **BLOCKED** because the supplied hosted admin account cannot authenticate: the auth user is awaiting email verification and its matching `profiles` row still has the `student` role. Admin browser acceptance therefore cannot be claimed. The single hosted project-interest test record is prepared but has not been submitted or confirmed in the admin inbox.

Browser acceptance completed at 375px, 768px, 1024px, and 1440px for `/account`, `/researcher`, `/researcher/publications`, and `/researcher/publications/new`. Student denial of `/researcher` and `/admin` was also verified. The mobile workspace menu opens, closes with Escape, restores focus to its trigger, shows the active destination, and introduces no horizontal overflow. The supplied researcher has no publication records, so `/researcher/publications/[id]` could not be exercised with real hosted data.

`npm run check` and the full test suite pass. The default production build reaches the known local Turbopack worker-port sandbox restriction; the webpack production build passes. Phase 2 remains **NEXT** and must not start until the hosted admin account, project-interest round trip, and remaining role-specific browser routes pass acceptance.

## Phase 2 — Research Submission Preflight

**Issue:** WEB-31
**Status:** NEXT

Build one coherent submission-readiness flow before final researcher submission.

### A. Potentially related research

Compare the title and abstract with existing published Hub publications and, where appropriate, indexed research metadata. Use deterministic and explainable similarity. Present potentially related research with its title, a plain-language match explanation, useful overlapping keywords or phrases, and links to known Hub records.

Do not call this plagiarism detection, Turnitin, plagiarism certification, or make any equivalent guarantee.

### B. Research topic and tag suggestions

Use the publication title, abstract, and existing research-area taxonomy to generate deterministic keyword, keyphrase, and topic suggestions. Map suggestions to existing research areas only where confidence is meaningful. The researcher reviews suggestions; the system does not create new official taxonomy automatically.

### C. Citation readiness

Validate only what the application can inspect deterministically: whether references are present, reference count, obvious duplicate references, DOI syntax, parseable URLs, and obvious missing year, author, or title patterns where detectable.

Never claim citation correctness, source credibility, academic correctness, plagiarism-free status, or peer-review compliance.

Decide during implementation whether references remain ephemeral preflight input. Prefer no migration. If persistence or schema work is required, stop and coordinate before applying it. Admin users may see or recompute neutral preflight signals where useful.

## Phase 3 — Connected Search + public visual parity

**Issues:** WEB-6 + final WEB-29 acceptance
**Status:** PLANNED

Build one public search query across Research Areas, Researchers, Projects, and Published Publications, grouped by entity type and constrained to current public data boundaries. Do not require embeddings or semantic search. Events and opportunities may remain absent while there is no credible data source.

Browser-review every public route against the homepage benchmark. Improve routes that still feel generic, reduce repetitive cards, strengthen relationship-led layouts, preserve the IJMR/editorial system, and integrate only approved, real IJMR resources. The phase exits when the homepage is no longer dramatically stronger than the rest of the public site.

## Phase 4 — Research Intelligence / Qwen closure

**Status:** PLANNED

Keep the current Qwen backend, indexed papers, grounded query, recommendation, comparison, global assistant, and same-origin server boundary. Finish live Next.js compare-proxy acceptance, paper selection and context clarity, publication-level “Ask about this paper” integration, hard-negative behavior, related-research presentation, degraded/offline states, secret-boundary verification, and assistant polish. The normal site must remain usable when Qwen is unavailable.

Complete trusted HTTPS or private networking only if it is explicitly available and safe within the remaining time. Otherwise document the current HTTP EC2 endpoint as a demo-infrastructure limitation without destabilizing AWS networking.

## Phase 5 — Demo acceptance / freeze / release

**Issue:** WEB-16
**Status:** PLANNED

Add no new features. Run the complete hosted journeys:

- Anonymous: Home → Search → Research area → Researcher → Project → Publication → Qwen.
- Student: Sign in → account → project → Get Involved → real interest submission.
- Researcher: Sign in → workspace → submission preflight → submit → review feedback → edit/resubmit.
- Admin: Sign in → dashboard → Needs Attention → queue → review detail → request changes or publish → student interest inbox.

Verify 375px, 768px, 1024px, and 1440px layouts; keyboard navigation; visible focus; browser consoles; routes; data fidelity; privacy; DEMO DATA labels; production build; hosted Supabase; Qwen; deployment; README and handoff docs; the demo script; and known limitations. Merge `dev` to `main` only after acceptance, then freeze features.

## Non-goals before submission

These issues remain intentionally deferred unless Phases 1–5 finish early:

- WEB-18 events CMS
- WEB-19 opportunities CMS
- WEB-20 grants
- WEB-21 notifications
- WEB-23 researcher profile moderation
- WEB-24 semantic embeddings
- WEB-26 personalization
- WEB-27 partner integrations

They must not distract from final delivery.
