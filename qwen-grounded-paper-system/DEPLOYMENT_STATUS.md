# Grounded Paper API deployment status — 2026-09-12

## Delivered

- The EC2 `qwen-api.service` is active with Ollama `qwen2.5:3b` and eight indexed papers.
- `/api/papers`, `/api/query`, `/api/compare` and `/api/recommend` pass authenticated live verification.
- A deployed absent-claim probe returned the exact hard-negative response with `hard_negative: true`.
- `/api/recommend` is deterministic, uses only indexed lexical overlap, returns real paper identifiers/titles/shared terms and remains available if Ollama is offline.
- Query and compare return a structured, retryable HTTP 503 instead of reporting an Ollama failure as a successful grounded answer.
- Missing papers, missing sections, malformed fields, invalid JSON and oversized bodies have stable JSON error codes.
- Health returns HTTP 503/degraded when Ollama or the configured model is unavailable.
- Authentication is constant-time. The API key is required from `QWEN_API_KEY`; it is not generated, persisted or printed by application code.
- The public browser credential-entry dashboard is disabled. Untrusted origins receive no CORS permission. The intended trust boundary is Next.js server to Qwen server.
- The key disclosed during development was rotated again during deployment. The remote key and environment files are mode `600`; the local copy is only in ignored `.env.local`. No credential value is documented here.
- The systemd service reads `/home/ubuntu/.api_key_env`, runs as `ubuntu`, and uses `NoNewPrivileges`, private temporary storage and read-only system/home protection with narrow writable paper/output paths.
- A recoverable pre-deployment code backup exists at `/home/ubuntu/qwen-backup-20260912-api-v1`.

## Evidence

- Local contract/parser/watcher suite: 10/10 passed.
- EC2 endpoint contract suite with a fake offline bridge: 6/6 passed before activation.
- EC2 real parser/watcher/Qwen grounding suite: 7/7 passed after activation.
- External safe verifier: papers, query, compare and recommend all passed; eight papers indexed.
- Live security checks: no-key papers request returned 401 `UNAUTHORIZED`; untrusted CORS origin was not allowed; root returned API information rather than a key-entry page.

## Remaining deployment limitation

The current EC2 public endpoint uses plain HTTP. API-key authentication does not encrypt transport. Before production or Vercel integration, put the API behind a trusted HTTPS reverse proxy/load balancer and restrict direct port `8000` access at the AWS security group/firewall. A domain/certificate or private-network design is required and was not available in this task. Until then, treat the deployment as hackathon/demo infrastructure rather than production-ready internet infrastructure.

Rate limiting and Hub-user authorization belong at the public Next.js/API gateway boundary. The Qwen service authenticates its trusted server caller; it does not understand Supabase users or roles.

## Frontend handoff

Use `FRONTEND_CONNECT_GUIDE.md` as the canonical contract. Keep `QWEN_BACKEND_URL` and `QWEN_API_KEY` server-only, validate browser input with Zod, expose only narrow routes, use `Cache-Control: no-store`, provide source paper/section context, and keep normal research pages usable during an AI outage.
