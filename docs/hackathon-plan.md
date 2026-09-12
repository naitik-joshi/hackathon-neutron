# 24-hour plan
A owns architecture, integration and backend support. B owns auth, backend workflows and security. C owns public discovery UI/UX. D owns researcher/admin UI/UX. These are ownership areas, not silos; pair on cross-boundary work.

Hours 0–2: clone, configure Supabase, run checks, rehearse baseline workflow. Hours 2–16: focused 30–90 minute issues with short integration checkpoints every two hours. Raise blockers within 15 minutes. Hours 16–20: integrate and test full journeys; freeze schema and dependencies. Hours 20–22: feature freeze, fixes only. Hours 22–24: demo rehearsal, seed verification and backup screenshots.

Main must stay healthy. One reviewer per PR; review auth/schema changes with B or A. Small PRs explain behavior, tests and limitations. Agree hot-file ownership before editing; migrations require explicit coordination. Pull before branching, avoid broad formatting, and communicate migration order. After real Linear IDs exist use feat/WEB-17-short-name, fix/WEB-17-short-name or chore/WEB-17-short-name; PR title WEB-17: Description. Enable the GitHub integration in Linear workspace settings later; no identity mapping is assumed.
