# Grounded Paper API — Next.js server integration contract

This document is the handoff contract for the R&D Hub frontend owner. The browser must call a Next.js server Route Handler or Server Action; only that server code may call this backend.

## Configuration and trust boundary

Configure these only in `.env.local` for local Next.js development and in server-side Vercel environment variables for deployment:

```dotenv
QWEN_BACKEND_URL=https://your-grounded-api.example
QWEN_API_KEY=your-rotated-server-only-secret
```

- Never use a `NEXT_PUBLIC_` prefix for either value.
- Never send `QWEN_API_KEY` to a Client Component, browser, analytics system or log.
- Do not use a Next.js rewrite that lets browsers call arbitrary backend paths. Create narrow server handlers, validate their input, authenticate/authorize the Hub user where appropriate, and add rate limiting at the public edge.
- The backend accepts `X-API-Key` or `Authorization: Bearer`; the Next.js integration should consistently use `X-API-Key`.
- Backend request bodies are limited to 32 KiB. Paper names are limited to 255 characters, sections to 200 and questions to 2,000.
- The current EC2 endpoint may be HTTP. Production Next.js should call it server-side through HTTPS or a private network/TLS reverse proxy before launch.

Canonical base paths below include `/api`. All protected calls include `Content-Type: application/json` and `X-API-Key`.

## Success contracts

### `GET /api/papers`

```json
{
  "status": "success",
  "count": 2,
  "papers": [
    {
      "filename": "paper.pdf",
      "title": "Stored document title",
      "section_count": 18,
      "sections": ["Abstract", "4. Results and Discussion"]
    }
  ]
}
```

This endpoint reads the in-memory index and remains usable if Ollama is offline.

### `POST /api/query`

```json
{
  "paper_name": "paper.pdf",
  "section": "Abstract",
  "question": "What problem does the paper address?"
}
```

`section` is optional; the backend then uses a small deterministic keyword map and defaults to `Abstract`. `section_name` remains accepted as a compatibility alias, but new integration code should send `section`.

```json
{
  "status": "success",
  "paper_name": "paper.pdf",
  "section_matched": "Abstract",
  "question": "What problem does the paper address?",
  "answer": "Answer grounded in that section.",
  "latency_ms": 1200.5,
  "is_grounded": true,
  "hard_negative": false
}
```

When the requested fact is absent, the request still succeeds with `hard_negative: true` and the exact answer `Information not available in the provided document(s).`

### `POST /api/compare`

```json
{
  "paper_1": "paper-one.pdf",
  "paper_2": "paper-two.pdf",
  "section": "4. Results and Discussion",
  "question": "How do the reported results differ?"
}
```

Both papers must contain the requested section. The success response contains `status`, resolved `paper_1`, resolved `paper_2`, resolved `section`, `question`, `answer`, `latency_ms`, `is_grounded` and `hard_negative`.

### `POST /api/recommend`

```json
{ "current_paper": "paper-one.pdf" }
```

```json
{
  "status": "success",
  "source_paper": "paper-one.pdf",
  "recommendation": {
    "paper_name": "paper-two.pdf",
    "title": "Stored document title",
    "similarity_score": 12.5,
    "shared_keywords": ["grounded systems"]
  },
  "recommendations": [],
  "method": "indexed_lexical_overlap",
  "model_used": false
}
```

The first item is repeated as `recommendation` for a simple related-paper card. When nothing overlaps, it is `null` and `recommendations` is empty. This is intentionally deterministic and remains available while Ollama is offline; it does not invent an AI explanation.

### `GET /api/health`

No API key is required. Returns HTTP 200 with `status: "healthy"` when Ollama responds. Returns HTTP 503 with `status: "degraded"` and `ollama_ready: false` when inference is unavailable.

## Error contract

All non-success responses use:

```json
{
  "status": "error",
  "error": {
    "code": "MODEL_UNAVAILABLE",
    "message": "The grounded model is temporarily unavailable.",
    "retryable": true
  }
}
```

| HTTP | Code | Meaning |
|---:|---|---|
| 400 | `INVALID_JSON`, `INVALID_REQUEST`, `INVALID_FIELD`, `MISSING_FIELD`, `FIELD_TOO_LONG` | Caller input is malformed. |
| 401 | `UNAUTHORIZED` | Server credential is absent or invalid. Never expose this response detail to browser logs. |
| 404 | `PAPER_NOT_FOUND`, `ENDPOINT_NOT_FOUND` | Indexed paper or route does not exist. |
| 413 | `PAYLOAD_TOO_LARGE` | Body exceeds 32 KiB. |
| 422 | `SECTION_NOT_FOUND` | Requested/inferred section is unavailable, or comparison papers do not both contain it. |
| 503 | `MODEL_UNAVAILABLE` | Query/compare inference is offline; show a retry state. |

## Minimal Next.js server-side requirements

The frontend owner should create separate, narrow Route Handlers for papers, query, compare and recommend. Each must:

1. import `server-only` in the backend client module;
2. read and validate configuration at server startup/request time;
3. validate browser input with Zod before forwarding;
4. allow only the documented fields and endpoint;
5. apply a shorter frontend-facing timeout than the backend's 180-second inference limit;
6. forward status codes and safe JSON error codes without internal exception details;
7. set `Cache-Control: no-store` for responses;
8. never log request headers, keys, full paper content or model prompts;
9. enforce rate/abuse controls before exposing query and compare publicly;
10. keep normal public research pages independent so an AI outage never blocks discovery.

Suggested server-only TypeScript types should mirror the JSON above. Do not treat `is_grounded` as independent proof of truth: display the resolved paper and section beside every answer and provide a link back to the source publication.

## Deployment verification

From this directory, after configuring the two server-only variables:

```bash
python verify_ec2_api.py
```

The verifier calls papers, query, compare and recommend, but prints only pass/fail and indexed-paper count—never credentials or paper contents.
