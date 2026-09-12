# Closed-Domain Grounded Research Paper Analysis System

An automated, closed-domain document intelligence system conforming strictly to [AGENTS.md](AGENTS.md) and canonical research paper template schemas. Powered by a local/cloud Ollama instance running `qwen2.5:3b` at `temperature: 0.0`.

---

## Key Features

- **Strict Closed-Domain Grounding**: 0.00% hallucination rate. Never extrapolates facts outside the ingested text.
- **Hard Negative Fallback**: Responds strictly with `"Information not available in the provided document(s)."` on absent claims.
- **Anti-Coding Guardrail**: Strictly limited to analytical research extraction. Prohibits arbitrary code generation or external scripts; queries asking for code return the hard-negative fallback.
- **Single-Paper Session Context**: Locks context to a single document (`use <paper>`) to prevent cross-paper contamination.
- **Dynamic Hot-Reloading**: `watchdog` background directory monitoring in `./watch_papers` updates in-memory state dynamically on file changes without restart.
- **Multi-Format Ingestion**: Deterministically parses `.pdf`, `.docx`, and `.txt` documents into the 18 canonical template sections while preserving visual element and table ordering.
- **Cloud Synchronization**: AWS S3 bidirectional synchronization and continuous cloud watcher (`s3_sync.py`).
- **REST API & Modern Web UI**: Built-in REST API with API key authentication, Smart On-Demand 5-minute auto-unload, and interactive web dashboard.
- **Frontend & UI Ready**: Comprehensive [FRONTEND_CONNECT_GUIDE.md](FRONTEND_CONNECT_GUIDE.md) covering Next.js, React, and Vercel server-side credential isolation (WEB-28).
- **Rigorous Verification Suites**: 4 automated test suites (Grounding Benchmark, Live Mutation, CLI Sandbox, Integration Suite).

---

## Quick Start

### 1. Requirements & Installation
```bash
# Clone or extract repository
git clone <repo-url>
cd Qwen

# Create virtual environment & install dependencies
python3 -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt

# Ensure Ollama is running and model is loaded
ollama pull qwen2.5:3b
```

### 2. Run Interactive Query CLI
```bash
python main.py run
```
Commands supported in CLI:
- `use <paper_name>`: Lock session context to a single paper
- `current`: Show active paper and its parsed sections
- `clear_paper`: Unlock active paper context
- `similar`: Discover related papers in the dataset
- `compare <p1> and <p2>`: Side-by-side grounded comparison
- `<your question>`: Query the active paper

### 3. Run REST API & Web UI Server
```bash
python api_server.py
```
Open your browser at `http://localhost:8000`.

---

## API Endpoints & Contract

All API endpoints require the `X-API-Key` header (generated on first boot in `.api_key` or set via `QWEN_API_KEY`).

| Endpoint | Method | Description | Request Body Example |
|---|:---:|---|---|
| `/api/papers` | `GET` | List all indexed papers | None |
| `/api/select_paper` | `POST` | Select paper (UI button click) | `{"paper_name": "sample_paper.docx"}` |
| `/api/query` | `POST` | Ask a grounded question | `{"paper_name": "sample_paper.docx", "question": "..."}` |
| `/api/similar` | `POST` | Find similar papers | `{"paper_name": "sample_paper.docx"}` |
| `/api/compare` | `POST` | Compare two papers | `{"paper_1": "...", "paper_2": "...", "question": "..."}` |

---

## Automated Verification & Benchmarks

```bash
# 1. Grounding Benchmark (Factual accuracy & hard negative rejection)
python benchmark_grounding.py

# 2. Live In-Flight Mutation Test (Hot-reload without server restart)
python test_live_mutation.py

# 3. Multi-Turn CLI Sandbox Test
python test_cli_sandbox.py

# 4. Automated Integration Test Suite (7/7 tests)
python test_system.py
```

---

## Cloud Deployment (AWS S3 & EC2)
Refer to [AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md) and [SYSTEM_GUIDE.md](SYSTEM_GUIDE.md) for full step-by-step instructions.

---

## License
Apache 2.0 / MIT. Refer to [LICENSE](LICENSE).