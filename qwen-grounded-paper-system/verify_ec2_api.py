import json
import urllib.request

key = open(".api_key").read().strip()

# 1. Query the live daemon running on port 8000
req = urllib.request.Request(
    "http://127.0.0.1:8000/api/query",
    data=json.dumps({
        "paper_name": "sample_paper.docx",
        "question": "What was the measured hallucination rate of Our Grounded System in Table 1?"
    }).encode("utf-8"),
    headers={"Content-Type": "application/json", "X-API-Key": key}
)

with urllib.request.urlopen(req) as res:
    data = json.loads(res.read().decode())
    print("==================================================")
    print("LIVE CLOUD DAEMON QUERY SUCCESSFUL!")
    print(f"Paper  : {data['paper_name']}")
    print(f"Section: {data['section_matched']}")
    print(f"Answer : {data['answer']}")
    print(f"Latency: {data['latency_ms']} ms")
    print("==================================================")
