# Research Paper Assistant integration

The Research Paper Assistant is a non-load-bearing public feature. Normal research pages, authentication and private workspaces do not depend on Qwen availability.

## Trust boundary

The browser calls only same-origin Next.js routes under `/api/research-assistant/`. A server-only client validates `QWEN_BACKEND_URL` and `QWEN_API_KEY`, attaches the backend credential, disables caching and maps backend failures to a small public error contract. Neither environment value is returned to Client Components or browser responses.

Required server environment variable names:

```dotenv
QWEN_BACKEND_URL=
QWEN_API_KEY=
```

## Same-origin routes

- `GET /api/research-assistant/papers`
- `GET /api/research-assistant/health`
- `POST /api/research-assistant/query`
- `POST /api/research-assistant/recommend`
- `POST /api/research-assistant/compare`

POST bodies are strict Zod schemas. Paper names are limited to 255 characters, sections to 200, questions to 2,000 and bodies to 32 KiB. Responses use `Cache-Control: no-store`. Public failures contain only `code`, `message` and `retryable`.

## UI behavior

One global assistant is rendered by the application shell for anonymous visitors and every authenticated role. It keeps an ephemeral local transcript; each question is sent independently and is not represented as model conversation memory. Successful answers display the resolved source paper and section. Hard-negative answers are preserved unchanged.

Every public publication detail includes an **Analyze this paper** action that opens the same assistant. Automatic selection occurs only when the normalized publication title exactly matches an indexed Qwen paper title; the display-only `DEMO DATA` prefix is ignored. Otherwise the user must explicitly select a paper. No loose or silent fuzzy match is used.

Selecting a paper requests deterministic related indexed research. Compare mode is secondary to the primary question flow and sends two explicit paper names plus the current question.

## Failure and abuse behavior

Missing configuration, timeouts and model outages produce an unavailable/retry state inside the assistant without failing the surrounding page. A best-effort in-memory fixed-window limiter applies separate limits to papers, health, query, recommend and compare. This is suitable only for the hackathon server boundary; multi-instance production needs a shared rate-limit store or edge-provider control.

The UI derives one state from both model health and a validated paper index. It reports `Assistant ready` only when the backend is healthy and at least one structurally valid paper is available. An index failure is labelled separately and disables analysis until retry succeeds. A normal 4xx request error does not incorrectly mark the entire model offline.

Live acceptance on 2026-09-13 passed through the same-origin Next.js routes: health reported eight indexed documents and a ready Qwen model; positive query was grounded; the absent-fact response exactly matched the hard negative; recommendation used deterministic `indexed_lexical_overlap` without the model; and a positive comparison completed in 29.2 seconds. The EC2 title extractor was redeployed so IJMR PDFs expose article titles instead of repeated journal mastheads.

The currently configured EC2 endpoint uses plain HTTP. Local/demo server-side integration can use it, but production deployment requires trusted HTTPS or private networking and should restrict direct port 8000 access.
