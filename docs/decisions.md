# Decisions

## 001 Next.js instead of React SPA + separate backend
Decision: Use App Router and Server Actions.

Reason: One TypeScript application is quicker for four students to understand.

Consequence: Keep domain logic out of route components.

## 002 PostgreSQL / Supabase
Decision: Use relational PostgreSQL with Supabase Auth.

Reason: Research entities have many-to-many relationships.

Consequence: Maintain SQL, types and RLS together.

## 003 Researchers submit, admins publish
Decision: Only admins approve and publish.

Reason: Institutional claims need review.

Consequence: Enforce transitions in the database, not just UI.

## 004 Public discovery requires no login
Decision: Public research remains anonymous-readable.

Reason: Discovery should have no unnecessary barrier.

Consequence: Private rows require separate policies.

## 005 SQL migrations are stored in Git
Decision: Version schema changes as SQL.

Reason: Reproducibility and review matter.

Consequence: Coordinate migrations and never rewrite shared ones.

## 006 RLS is required
Decision: Enable RLS from the first migration.

Reason: The Data API is accessible outside our UI.

Consequence: Test hostile direct writes.

## 007 AI is not part of the v0.1 critical path
Decision: Defer AI.

Reason: A working research workflow matters first.

Consequence: No embeddings or AI dependencies.

## 008 Events may link to external registration systems
Decision: Allow future external registration links.

Reason: Avoid rebuilding ticketing in a hackathon.

Consequence: Validate URLs and explain external navigation.

## 009 Demo institutional data must be visibly marked
Decision: Use is_demo and DEMO DATA labels.

Reason: Do not invent institutional evidence.

Consequence: Preserve labels in cards and detail pages.
