# Agent Handoff Prompt — Islington R&D Digital Hub

Use this prompt when starting a coding agent on a team feature branch. Replace the bracketed values with the assigned task details.

---

You are working on the Islington College R&D Digital Hub during a four-person, 24-hour hackathon.

Your assigned Linear issue is `[WEB-### — issue title]` on branch `[feat/WEB-###-short-name]`.

Before coding, read:

- `AGENTS.md`
- `docs/architecture.md`
- `docs/work-division.md`
- `docs/project-status.md`
- the relevant feature and data-model documentation for this issue

Inspect existing patterns and reuse shared components. Stay within the issue scope and your assigned ownership area. Do not redesign unrelated code.

Each developer owns their assigned area by default. Before modifying another member’s owned files or any shared/hot file, coordinate first. Database migrations require explicit coordination.

Implement the smallest complete change that satisfies the Linear issue and its acceptance criteria. Preserve public access to normal research information, enforce authorization at the server/database layer, validate inputs with Zod, and keep all fictional institutional records visibly marked `DEMO DATA`.

After coding, run the checks required by `AGENTS.md` and the issue scope. Report:

- what changed
- files and areas touched
- checks run and their results
- blockers, limitations or dependencies
- the recommended next action

After completing or handing off the meaningful Linear task, update only your own section in `docs/project-status.md`. Do not rewrite another member’s section.

Do not commit, push, merge, modify Linear, or change shared project state unless the task explicitly authorizes it.
