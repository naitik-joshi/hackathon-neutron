"""Safe deployed-API verifier. Never prints credentials or paper contents."""

import json
import os
from pathlib import Path
import urllib.error
import urllib.request


def load_local_env() -> None:
    candidates = (
        Path(__file__).parent / ".env.local",
        Path(__file__).parent.parent / ".env.local",
    )
    for candidate in candidates:
        if not candidate.exists():
            continue
        for line in candidate.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            name, value = line.split("=", 1)
            os.environ.setdefault(name.strip(), value.strip().strip('"').strip("'"))


def request(base_url, api_key, method, path, body=None):
    request_data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        f"{base_url}/api/{path}",
        data=request_data,
        headers={"X-API-Key": api_key, "Content-Type": "application/json"},
        method=method,
    )
    try:
        response = urllib.request.urlopen(req, timeout=210)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        return response.status, json.loads(response.read().decode())


def main() -> int:
    load_local_env()
    base_url = os.environ.get("QWEN_BACKEND_URL", "").rstrip("/")
    api_key = os.environ.get("QWEN_API_KEY", "")
    if base_url.endswith("/api"):
        base_url = base_url[:-4]
    if not base_url or not api_key:
        print("FAIL: configure QWEN_BACKEND_URL and QWEN_API_KEY server-side.")
        return 1

    checks = []
    status, papers = request(base_url, api_key, "GET", "papers")
    checks.append(("papers", status == 200 and papers.get("status") == "success"))
    indexed = papers.get("papers", []) if status == 200 else []
    if not indexed:
        error_value = papers.get("error", {})
        error_code = (
            error_value.get("code", "NO_INDEXED_PAPERS")
            if isinstance(error_value, dict)
            else "LEGACY_ERROR_RESPONSE"
        )
        print(f"FAIL: /api/papers returned HTTP {status} ({error_code}).")
        return 1
    paper_1 = indexed[0]["filename"]
    paper_2 = indexed[1]["filename"] if len(indexed) > 1 else paper_1

    status, query = request(
        base_url,
        api_key,
        "POST",
        "query",
        {"paper_name": paper_1, "section": "Abstract", "question": "What subject does this abstract discuss?"},
    )
    checks.append(("query", status == 200 and query.get("is_grounded") is True and "answer" in query))
    status, compare = request(
        base_url,
        api_key,
        "POST",
        "compare",
        {"paper_1": paper_1, "paper_2": paper_2, "section": "Abstract", "question": "Compare the subjects discussed."},
    )
    checks.append(("compare", status == 200 and compare.get("is_grounded") is True))
    status, recommend = request(
        base_url, api_key, "POST", "recommend", {"current_paper": paper_1}
    )
    checks.append(("recommend", status == 200 and "recommendations" in recommend))

    for name, passed in checks:
        print(f"{'PASS' if passed else 'FAIL'}: /api/{name}")
    print(f"Indexed papers: {len(indexed)}")
    return 0 if all(passed for _, passed in checks) else 1


if __name__ == "__main__":
    raise SystemExit(main())
