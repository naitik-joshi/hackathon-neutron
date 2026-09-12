"""
REST API & Web UI Server for Closed-Domain Grounded Research Paper Analysis.
Features:
- API Key Authentication (X-API-Key or Authorization: Bearer)
- Instant warm Ollama inference (keep_alive: -1)
- Live watchdog background synchronization
- CORS-enabled REST endpoints for UI button clicks and query submissions
- Server-to-server integration contract; the legacy dashboard is not served
- Systemd socket-activation / on-demand request startup support
"""

import os
import sys
import re
import json
import time
import secrets
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn
from typing import Dict, Any

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from config import HARD_NEGATIVE_RESPONSE, MODEL_NAME, TEMPERATURE
from store import DocumentStore
from ollama_bridge import GroundedOllamaBridge, ModelUnavailableError


# =====================================================================
# API Key Security Manager
# =====================================================================
def get_or_create_api_key() -> str:
    """Read the API credential from the process environment only."""
    env_key = os.environ.get("QWEN_API_KEY", "").strip()
    if len(env_key) < 32:
        raise RuntimeError(
            "QWEN_API_KEY must be set to a secret of at least 32 characters."
        )
    return env_key

SERVER_API_KEY = os.environ.get("QWEN_API_KEY", "").strip()


# =====================================================================
# Global Singletons & Ingestion
# =====================================================================
store = DocumentStore()
bridge = GroundedOllamaBridge()
watcher = None

_runtime_started = False


def initialize_runtime() -> None:
    """Initialize ingestion once at server startup, not during module import."""
    global _runtime_started, watcher
    if not _runtime_started:
        from watcher import PaperWatcher

        watcher = PaperWatcher(store)
        watcher.scan_existing_files()
        watcher.start()
        _runtime_started = True

import threading
# Smart On-Demand: 0% CPU & 0% Model RAM on idle. Warmed only when paper is clicked or queried.


# =====================================================================
# Built-in Interactive Web UI with API Key Header Management
# =====================================================================
HTML_DASHBOARD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grounded Research Paper Assistant</title>
  <style>
    :root {
      --bg: #0d1117;
      --card-bg: #161b22;
      --border: #30363d;
      --primary: #58a6ff;
      --accent: #238636;
      --text: #c9d1d9;
      --text-dim: #8b949e;
      --highlight: #1f6feb;
      --danger: #f85149;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    #sidebar {
      width: 340px;
      border-right: 1px solid var(--border);
      background: var(--card-bg);
      display: flex;
      flex-direction: column;
    }
    .header {
      padding: 16px;
      border-bottom: 1px solid var(--border);
    }
    .header h2 { font-size: 16px; color: #fff; margin-bottom: 4px; }
    .header p { font-size: 12px; color: var(--text-dim); }
    #paper-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }
    .paper-card {
      background: #0d1117;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .paper-card:hover { border-color: var(--primary); transform: translateY(-1px); }
    .paper-card.active { border-color: var(--primary); background: #1f242c; box-shadow: 0 0 10px rgba(88,166,255,0.15); }
    .paper-card h4 { font-size: 13px; color: #fff; margin-bottom: 4px; word-break: break-word; }
    .paper-card .meta { font-size: 11px; color: var(--text-dim); }
    .badge {
      display: inline-block;
      font-size: 10px;
      padding: 2px 6px;
      background: #21262d;
      border-radius: 12px;
      color: var(--primary);
      margin-top: 4px;
    }
    #main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--bg);
    }
    #top-bar {
      padding: 12px 20px;
      background: #161b22;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    #active-banner .title { font-size: 14px; font-weight: 600; color: #fff; }
    .auth-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .auth-box input {
      background: #0d1117;
      border: 1px solid var(--border);
      color: #fff;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      width: 200px;
    }
    .auth-box button {
      background: #21262d;
      color: var(--primary);
      border: 1px solid var(--border);
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
    }
    .auth-box button:hover { background: #30363d; }
    #chat-history {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .msg {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.5;
    }
    .msg.user {
      align-self: flex-end;
      background: var(--highlight);
      color: #fff;
    }
    .msg.assistant {
      align-self: flex-start;
      background: var(--card-bg);
      border: 1px solid var(--border);
    }
    .msg.error {
      align-self: flex-start;
      background: rgba(248,81,73,0.1);
      border: 1px solid var(--danger);
      color: #ff7b72;
    }
    .msg .meta-tag {
      font-size: 11px;
      color: var(--text-dim);
      margin-bottom: 4px;
    }
    #input-bar {
      padding: 16px 20px;
      border-top: 1px solid var(--border);
      background: var(--card-bg);
      display: flex;
      gap: 12px;
    }
    #query-input {
      flex: 1;
      background: #0d1117;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 10px 14px;
      color: #fff;
      font-size: 14px;
      outline: none;
    }
    #query-input:focus { border-color: var(--primary); }
    button.btn {
      background: var(--accent);
      color: #fff;
      border: none;
      padding: 10px 18px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    button.btn:hover { opacity: 0.9; }
    button.btn:disabled { opacity: 0.5; cursor: not-allowed; }
  </style>
</head>
<body>
  <div id="sidebar">
    <div class="header">
      <h2>Research Papers</h2>
      <p>Click a paper to lock session context</p>
    </div>
    <div id="paper-list">Loading papers...</div>
  </div>

  <div id="main-area">
    <div id="top-bar">
      <div id="active-banner">
        <div class="title" id="active-paper-label">Select a paper to begin</div>
        <div id="active-meta" style="font-size: 11px; color: var(--text-dim);">Closed-Domain Grounded</div>
      </div>
      <div class="auth-box">
        <span style="font-size: 12px; color: var(--text-dim);">🔑 Key:</span>
        <input type="password" id="api-key-input" placeholder="Enter API Key" />
        <button onclick="saveApiKey()">Save</button>
      </div>
    </div>

    <div id="chat-history">
      <div class="msg assistant">
        <div class="meta-tag">System Ready</div>
        Select any paper on the left to lock session context. Click any paper button to begin.
      </div>
    </div>

    <div id="input-bar">
      <input type="text" id="query-input" placeholder="Ask a question about the active paper..." disabled />
      <button class="btn" id="send-btn" disabled onclick="sendQuery()">Ask</button>
    </div>
  </div>

  <script>
    let activePaper = null;

    function getApiKey() {
      return localStorage.getItem('qwen_api_key') || '';
    }

    function saveApiKey() {
      const val = document.getElementById('api-key-input').value.trim();
      localStorage.setItem('qwen_api_key', val);
      appendMessage('assistant', 'API Key saved to browser session.');
      loadPapers();
    }

    async function loadPapers() {
      const key = getApiKey();
      const headers = key ? { 'X-API-Key': key } : {};
      try {
        const res = await fetch('/api/papers', { headers });
        if (res.status === 401) {
          document.getElementById('paper-list').innerHTML = '<div style="color:var(--danger);padding:10px;font-size:12px;">Authentication Required. Enter your API Key above.</div>';
          return;
        }
        const data = await res.json();
        const container = document.getElementById('paper-list');
        container.innerHTML = '';

        data.papers.forEach(p => {
          const card = document.createElement('div');
          card.className = 'paper-card';
          card.id = 'paper-' + encodeURIComponent(p.filename);
          card.innerHTML = `
            <h4>${p.filename}</h4>
            <div class="meta">${p.title || 'Untitled Document'}</div>
            <span class="badge">${p.section_count} sections</span>
          `;
          card.onclick = () => selectPaper(p.filename);
          container.appendChild(card);
        });
      } catch (e) {
        document.getElementById('paper-list').innerHTML = '<div style="color:var(--danger);padding:10px;">Failed to load papers.</div>';
      }
    }

    async function selectPaper(paperName) {
      const key = getApiKey();
      const res = await fetch('/api/select_paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': key
        },
        body: JSON.stringify({ paper_name: paperName })
      });
      if (res.status === 401) {
        appendMessage('error', 'Unauthorized: Please provide a valid API Key.');
        return;
      }
      const data = await res.json();
      activePaper = data.paper_name;

      document.querySelectorAll('.paper-card').forEach(c => c.classList.remove('active'));
      const activeEl = document.getElementById('paper-' + encodeURIComponent(paperName));
      if (activeEl) activeEl.classList.add('active');

      document.getElementById('active-paper-label').innerText = 'Active: ' + activePaper;
      document.getElementById('active-meta').innerText = `${data.total_sections} sections indexed | Zero-Extrapolation Grounded`;

      document.getElementById('query-input').disabled = false;
      document.getElementById('send-btn').disabled = false;
      document.getElementById('query-input').focus();

      appendMessage('assistant', `Session context locked to <strong>${activePaper}</strong>. Questions will be answered strictly from this paper.`);
    }

    async function sendQuery() {
      const input = document.getElementById('query-input');
      const question = input.value.trim();
      if (!question || !activePaper) return;

      appendMessage('user', question);
      input.value = '';
      input.disabled = true;
      document.getElementById('send-btn').disabled = true;

      const key = getApiKey();
      const start = Date.now();
      try {
        const res = await fetch('/api/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': key
          },
          body: JSON.stringify({ paper_name: activePaper, question: question })
        });

        if (res.status === 401) {
          appendMessage('error', '401 Unauthorized: Invalid or missing API key.');
          return;
        }

        const data = await res.json();
        const latency = (Date.now() - start);
        appendMessage('assistant', data.answer, `Section: ${data.section_matched} | ${latency}ms`);
      } catch (err) {
        appendMessage('error', 'Error communicating with server: ' + err);
      } finally {
        input.disabled = false;
        document.getElementById('send-btn').disabled = false;
        input.focus();
      }
    }

    function appendMessage(role, text, meta = '') {
      const chat = document.getElementById('chat-history');
      const msg = document.createElement('div');
      msg.className = 'msg ' + role;
      if (meta) {
        msg.innerHTML = `<div class="meta-tag">${meta}</div><div>${text}</div>`;
      } else {
        msg.innerHTML = text;
      }
      chat.appendChild(msg);
      chat.scrollTop = chat.scrollHeight;
    }

    document.getElementById('query-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendQuery();
    });

    // Populate API key input if stored
    const saved = getApiKey();
    if (saved) document.getElementById('api-key-input').value = saved;
    loadPapers();
  </script>
</body>
</html>
"""


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Multi-threaded HTTP server supporting systemd socket activation."""
    daemon_threads = True


class GroundedAnalysisAPIHandler(BaseHTTPRequestHandler):
    """
    REST API Handler with API Key Authentication and Closed-Domain Grounding.
    """

    def send_cors_headers(self):
        origin = self.headers.get("Origin", "").strip()
        allowed = {
            value.strip()
            for value in os.environ.get("QWEN_ALLOWED_ORIGINS", "").split(",")
            if value.strip()
        }
        if origin and origin in allowed:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization, X-API-Key",
            )

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def check_authenticated(self) -> bool:
        """Validate API key from X-API-Key header or Authorization: Bearer header."""
        req_key = self.headers.get("X-API-Key", "").strip()
        if not req_key:
            auth_header = self.headers.get("Authorization", "").strip()
            if auth_header.startswith("Bearer "):
                req_key = auth_header[7:].strip()

        return bool(SERVER_API_KEY) and secrets.compare_digest(req_key, SERVER_API_KEY)

    def _read_text(
        self,
        payload: Dict[str, Any],
        field: str,
        *,
        required: bool = False,
        default: str = "",
        max_length: int = 2_000,
    ):
        value = payload.get(field, default)
        if not isinstance(value, str):
            self._send_error(400, "INVALID_FIELD", f"'{field}' must be a string.")
            return None
        value = value.strip()
        if required and not value:
            self._send_error(400, "MISSING_FIELD", f"'{field}' is required.")
            return None
        if len(value) > max_length:
            self._send_error(
                400,
                "FIELD_TOO_LONG",
                f"'{field}' must not exceed {max_length} characters.",
            )
            return None
        return value

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        # Root is informational only. Credentials must never be entered into a
        # browser UI; the supported integration is server-to-server.
        if parsed.path in ["/", "/index.html"]:
            self._send_json(
                200,
                {
                    "service": "grounded-paper-api",
                    "status_endpoint": "/api/health",
                    "authentication": "server-side API key required",
                },
            )
            return

        # 2. Health check (Public)
        if parsed.path == "/api/health":
            model_ready = bridge.check_health()
            health = {
                "status": "healthy" if model_ready else "degraded",
                "indexed_papers_count": len(store.list_papers()),
                "model": MODEL_NAME,
                "temperature": TEMPERATURE,
                "ollama_ready": model_ready,
                "auth_required": True
            }
            self._send_json(200 if model_ready else 503, health)
            return

        # Protected Endpoints Require API Key
        if not self.check_authenticated():
            self._send_error(401, "UNAUTHORIZED", "A valid server API key is required.")
            return

        # 3. List papers (Protected)
        if parsed.path == "/api/papers":
            paper_names = store.list_papers()
            papers_meta = []
            for p in paper_names:
                sec_names = store.get_section_names(p)
                title = store.get_paper_title(p)
                papers_meta.append({
                    "filename": p,
                    "title": title,
                    "section_count": len(sec_names),
                    "sections": sec_names
                })
            self._send_json(200, {"status": "success", "count": len(papers_meta), "papers": papers_meta})
            return

        self._send_error(404, "ENDPOINT_NOT_FOUND", "Endpoint not found.")

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)

        # Enforce API Key Authentication on all POST endpoints
        if not self.check_authenticated():
            self._send_error(401, "UNAUTHORIZED", "A valid server API key is required.")
            return

        try:
            content_length = int(self.headers.get("Content-Length", 0))
        except (TypeError, ValueError):
            self._send_error(400, "INVALID_CONTENT_LENGTH", "Content-Length must be an integer.")
            return
        if content_length < 0 or content_length > 32_768:
            self._send_error(413, "PAYLOAD_TOO_LARGE", "Request body must not exceed 32 KiB.")
            return
        try:
            raw_body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
            payload = json.loads(raw_body)
        except (UnicodeDecodeError, json.JSONDecodeError):
            self._send_error(400, "INVALID_JSON", "Request body must be valid JSON.")
            return
        if not isinstance(payload, dict):
            self._send_error(400, "INVALID_REQUEST", "Request body must be a JSON object.")
            return

        # Endpoint 1: Paper Selection (Triggered by Button Click in UI)
        if parsed.path == "/api/select_paper":
            paper_name = self._read_text(
                payload, "paper_name", required=True, max_length=255
            )
            if paper_name is None:
                return

            resolved = store.resolve_paper_key(paper_name)
            if not resolved:
                self._send_error(404, "PAPER_NOT_FOUND", "Paper not found in dataset.")
                return

            sections = store.get_section_names(resolved)
            title = store.get_paper_title(resolved)
            _, _, abstract_text = store.get_section_text(resolved, "Abstract")

            # Smart On-Demand: Warm model asynchronously in background while user types query
            def _speculative_warm():
                try:
                    bridge.query_section(resolved, "Abstract", (abstract_text[:80] if abstract_text else "warmup"), "warmup")
                except Exception:
                    pass
            threading.Thread(target=_speculative_warm, daemon=True).start()

            response_data = {
                "status": "success",
                "paper_name": resolved,
                "title": title,
                "total_sections": len(sections),
                "sections": sections,
                "abstract_preview": (abstract_text[:400] + "...") if abstract_text else "",
                "message": f"Session context successfully locked to '{resolved}'"
            }
            self._send_json(200, response_data)
            return

        # Endpoint 2: Grounded Query (Triggered by User Submitting Question)
        if parsed.path == "/api/query":
            paper_name = self._read_text(
                payload, "paper_name", required=True, max_length=255
            )
            question = self._read_text(payload, "question", required=True)
            section_field = "section" if "section" in payload else "section_name"
            target_section = self._read_text(payload, section_field, max_length=200)
            if paper_name is None or question is None or target_section is None:
                return

            resolved_paper = store.resolve_paper_key(paper_name)
            if not resolved_paper:
                self._send_error(404, "PAPER_NOT_FOUND", "Paper not found in dataset.")
                return

            start_time = time.time()

            if not target_section:
                q_lower = question.lower()
                for sec in store.list_sections(resolved_paper):
                    sec_norm = re.sub(r"^[0-9]+\.?\s*", "", sec.lower())
                    if sec_norm in q_lower:
                        target_section = sec
                        break
                if not target_section:
                    if any(k in q_lower for k in ["accuracy", "result", "metric", "f1", "table", "performance", "score", "hallucination"]):
                        target_section = "4. Results and Discussion"
                    elif any(k in q_lower for k in ["method", "approach", "architecture", "dataset", "parser", "algorithm", "library"]):
                        target_section = "3. Methodology / Approach"
                    elif any(k in q_lower for k in ["grant", "fund", "sponsor"]):
                        target_section = "Funding"
                    elif any(k in q_lower for k in ["conclude", "summary", "finding"]):
                        target_section = "5. Conclusion"
                    else:
                        target_section = "Abstract"

            _, actual_sec, text = store.get_section_text(resolved_paper, target_section)
            if not actual_sec or not text:
                self._send_error(
                    422,
                    "SECTION_NOT_FOUND",
                    "The requested section is not available in this paper.",
                    {"available_sections": store.list_sections(resolved_paper)},
                )
                return
            try:
                answer = bridge.query_section(
                    resolved_paper, actual_sec, text, question
                )
            except ModelUnavailableError:
                self._send_error(
                    503,
                    "MODEL_UNAVAILABLE",
                    "The grounded model is temporarily unavailable.",
                    {"retryable": True},
                )
                return
            elapsed_ms = round((time.time() - start_time) * 1000, 2)

            response_data = {
                "status": "success",
                "paper_name": resolved_paper,
                "section_matched": actual_sec,
                "question": question,
                "answer": answer,
                "latency_ms": elapsed_ms,
                "is_grounded": True,
                "hard_negative": (answer.strip() == HARD_NEGATIVE_RESPONSE)
            }
            self._send_json(200, response_data)
            return

        # Endpoint 3: Find Similar Papers
        if parsed.path == "/api/similar":
            paper_name = self._read_text(
                payload, "paper_name", required=True, max_length=255
            )
            if paper_name is None:
                return
            resolved_paper = store.resolve_paper_key(paper_name)
            if not resolved_paper:
                self._send_error(404, "PAPER_NOT_FOUND", "Paper not found in dataset.")
                return

            similar = store.find_similar_papers(resolved_paper, top_n=5)
            formatted = [{
                "paper_name": name,
                "title": title,
                "similarity_score": score,
                "shared_keywords": shared
            } for name, title, score, shared in similar]

            self._send_json(200, {
                "status": "success",
                "source_paper": resolved_paper,
                "similar_papers": formatted
            })
            return

        # Endpoint 4: Deterministic related-paper recommendation.
        # This stays available when the model is offline because it uses only
        # lexical overlap from indexed document titles, keywords and abstracts.
        if parsed.path == "/api/recommend":
            current_paper = self._read_text(
                payload, "current_paper", required=True, max_length=255
            )
            if current_paper is None:
                return
            resolved_paper = store.resolve_paper_key(current_paper)
            if not resolved_paper:
                self._send_error(404, "PAPER_NOT_FOUND", "Paper not found in dataset.")
                return
            matches = store.find_similar_papers(resolved_paper, top_n=5)
            recommendations = [
                {
                    "paper_name": name,
                    "title": title,
                    "similarity_score": score,
                    "shared_keywords": shared,
                }
                for name, title, score, shared in matches
            ]
            self._send_json(
                200,
                {
                    "status": "success",
                    "source_paper": resolved_paper,
                    "recommendation": recommendations[0] if recommendations else None,
                    "recommendations": recommendations,
                    "method": "indexed_lexical_overlap",
                    "model_used": False,
                },
            )
            return

        # Endpoint 5: Cross-Paper Comparative Analysis
        if parsed.path == "/api/compare":
            paper1 = self._read_text(
                payload, "paper_1", required=True, max_length=255
            )
            paper2 = self._read_text(
                payload, "paper_2", required=True, max_length=255
            )
            section_field = "section" if "section" in payload else "section_name"
            section = self._read_text(
                payload,
                section_field,
                default="4. Results and Discussion",
                max_length=200,
            )
            question = self._read_text(payload, "question", required=True)
            if None in (paper1, paper2, section, question):
                return

            res1 = store.resolve_paper_key(paper1)
            res2 = store.resolve_paper_key(paper2)

            if not res1 or not res2:
                self._send_error(404, "PAPER_NOT_FOUND", "One or both papers were not found.")
                return

            _, section1, text1 = store.get_section_text(res1, section)
            _, section2, text2 = store.get_section_text(res2, section)
            if not section1 or not text1 or not section2 or not text2:
                self._send_error(
                    422,
                    "SECTION_NOT_FOUND",
                    "The requested section must exist in both papers.",
                )
                return

            start_time = time.time()
            try:
                answer = bridge.query_comparison(
                    res1, text1, res2, text2, section1, question
                )
            except ModelUnavailableError:
                self._send_error(
                    503,
                    "MODEL_UNAVAILABLE",
                    "The grounded model is temporarily unavailable.",
                    {"retryable": True},
                )
                return
            elapsed_ms = round((time.time() - start_time) * 1000, 2)

            self._send_json(200, {
                "status": "success",
                "paper_1": res1,
                "paper_2": res2,
                "section": section1,
                "question": question,
                "answer": answer,
                "latency_ms": elapsed_ms,
                "is_grounded": True,
                "hard_negative": (answer.strip() == HARD_NEGATIVE_RESPONSE),
            })
            return

        self._send_error(404, "ENDPOINT_NOT_FOUND", "Endpoint not found.")

    def _send_error(
        self,
        status_code: int,
        code: str,
        message: str,
        details: Dict[str, Any] | None = None,
    ):
        payload: Dict[str, Any] = {
            "status": "error",
            "error": {"code": code, "message": message},
        }
        if details:
            payload["error"].update(details)
        self._send_json(status_code, payload)

    def _send_json(self, status_code: int, data: Dict[str, Any]):
        response_bytes = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(response_bytes)

    def log_message(self, format, *args):
        # Use the standard formatter so malformed HTTP requests cannot crash
        # logging by supplying a different argument count.
        sys.stdout.write(f"[API] {self.address_string()} - {format % args}\n")


def run_api_server(host: str = "0.0.0.0", port: int = 8000):
    global SERVER_API_KEY
    SERVER_API_KEY = get_or_create_api_key()
    initialize_runtime()
    server = ThreadedHTTPServer((host, port), GroundedAnalysisAPIHandler)
    print("=" * 70)
    print(f"  GROUNDED RESEARCH ANALYSIS API SERVER RUNNING")
    print(f"  Local / Cloud Endpoint: http://{host}:{port}")
    print(f"  Health endpoint       : http://localhost:{port}/api/health")
    print("  API authentication    : configured from QWEN_API_KEY")
    print("=" * 70)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[API Server] Shutting down cleanly...")
        if watcher:
            watcher.stop()
        server.server_close()


if __name__ == "__main__":
    run_api_server(port=8000)
