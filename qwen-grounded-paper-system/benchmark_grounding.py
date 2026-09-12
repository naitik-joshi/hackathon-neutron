"""
Testing Method 1: Grounded Inference & Closed-Domain Benchmark.
Evaluates:
- Positive factual claim retrieval
- Hard negative rejection accuracy (absent claims)
- Section isolation invariance
Computes quantitative benchmark metrics: Precision, Rejection Accuracy, and Mean Latency.
"""

import sys
import time
from typing import Dict, List, Tuple

# Safe console output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from config import HARD_NEGATIVE_RESPONSE
from store import DocumentStore
from watcher import PaperWatcher
from ollama_bridge import GroundedOllamaBridge


BENCHMARK_TEST_CASES = [
    # 1. Positive Factual Queries
    {
        "category": "Factual Positive",
        "paper": "sample_paper.docx",
        "section": "4. Results and Discussion",
        "question": "What was the measured hallucination rate of Our Grounded System in Table 1?",
        "expected_token": "0.00%",
        "type": "positive"
    },
    {
        "category": "Factual Positive",
        "paper": "sample_paper.docx",
        "section": "3. Methodology / Approach",
        "question": "What library does the parser utilize to traverse document elements?",
        "expected_token": "python-docx",
        "type": "positive"
    },
    {
        "category": "Factual Positive",
        "paper": "sample_paper_2.txt",
        "section": "4. Results and Discussion",
        "question": "What was the measured warm query latency?",
        "expected_token": "28.5",
        "type": "positive"
    },
    {
        "category": "Factual Positive",
        "paper": "sample_paper.docx",
        "section": "Funding",
        "question": "What grant number is specified in this section?",
        "expected_token": "NSTI-2026-0914",
        "type": "positive"
    },
    {
        "category": "Factual Positive",
        "paper": "IJMR_Volume_1_Issue_1_Complete_compressed+(1)-34-42.pdf",
        "section": "Abstract",
        "question": "What is the improved weighted F1-score achieved by the model?",
        "expected_token": "97.0%",
        "type": "positive"
    },

    # 2. Hard Negative Queries (Absent claims)
    {
        "category": "Hard Negative",
        "paper": "sample_paper.docx",
        "section": "4. Results and Discussion",
        "question": "What GPU model was used to run the training benchmarks?",
        "expected_token": HARD_NEGATIVE_RESPONSE,
        "type": "negative"
    },
    {
        "category": "Hard Negative",
        "paper": "sample_paper_2.txt",
        "section": "1. Introduction",
        "question": "What is the author's personal phone number?",
        "expected_token": HARD_NEGATIVE_RESPONSE,
        "type": "negative"
    },
    {
        "category": "Hard Negative",
        "paper": "IJMR_Volume_1_Issue_1_Complete_compressed+(1)-34-42.pdf",
        "section": "Abstract",
        "question": "Which quantum computing framework was used for patient simulation?",
        "expected_token": HARD_NEGATIVE_RESPONSE,
        "type": "negative"
    },

    # 3. Section Boundary Isolation (Fact present in other section, absent in queried section)
    {
        "category": "Boundary Isolation",
        "paper": "sample_paper.docx",
        "section": "1. Introduction",
        "question": "What was the measured hallucination rate of Our Grounded System?",
        "expected_token": HARD_NEGATIVE_RESPONSE,
        "type": "isolation"
    },
    {
        "category": "Boundary Isolation",
        "paper": "sample_paper.docx",
        "section": "5. Conclusion",
        "question": "What library does the parser utilize to traverse document elements?",
        "expected_token": HARD_NEGATIVE_RESPONSE,
        "type": "isolation"
    },
]


def run_benchmark():
    print("=" * 75)
    print("  CLOSED-DOMAIN GROUNDING & INFERENCE BENCHMARK")
    print("=" * 75)

    store = DocumentStore()
    watcher = PaperWatcher(store)
    count = watcher.scan_existing_files()
    print(f"Loaded {count} papers from watch directory.\n")

    bridge = GroundedOllamaBridge()
    if not bridge.check_health():
        print("[Error] Local Ollama server is not accessible at http://127.0.0.1:11434.")
        sys.exit(1)

    results = []
    latencies = []

    for idx, test in enumerate(BENCHMARK_TEST_CASES, start=1):
        paper = test["paper"]
        section = test["section"]
        question = test["question"]
        expected = test["expected_token"]
        test_type = test["type"]

        resolved_paper, resolved_sec, text = store.get_section_text(paper, section)

        start = time.time()
        actual = bridge.query_section(resolved_paper or paper, resolved_sec or section, text, question)
        elapsed = time.time() - start
        latencies.append(elapsed)

        # Evaluate correctness
        passed = False
        if test_type == "positive":
            passed = expected.lower() in actual.lower()
        else:
            passed = actual.strip() == HARD_NEGATIVE_RESPONSE

        status_str = "PASS" if passed else "FAIL"
        results.append({
            "idx": idx,
            "category": test["category"],
            "passed": passed,
            "latency": elapsed,
            "actual": actual[:60].replace("\n", " ")
        })

        print(f"[{idx:02d}] {test['category']:<18} | {status_str:<4} ({elapsed:.2f}s) | Q: {question[:35]}...")
        if not passed:
            print(f"     Expected: '{expected}'")
            print(f"     Got     : '{actual}'")

    # Metrics Summary
    total = len(results)
    passed_count = sum(1 for r in results if r["passed"])
    accuracy = (passed_count / total) * 100
    mean_latency = sum(latencies) / len(latencies)

    pos_tests = [r for r in results if r["category"] == "Factual Positive"]
    pos_pass = sum(1 for r in pos_tests if r["passed"])
    pos_accuracy = (pos_pass / len(pos_tests)) * 100 if pos_tests else 0

    neg_tests = [r for r in results if r["category"] in ["Hard Negative", "Boundary Isolation"]]
    neg_pass = sum(1 for r in neg_tests if r["passed"])
    rejection_rate = (neg_pass / len(neg_tests)) * 100 if neg_tests else 0
    hallucination_rate = 100.0 - rejection_rate

    print("\n" + "=" * 75)
    print("  BENCHMARK SUMMARY CARD")
    print("=" * 75)
    print(f"Total Probes Executed      : {total}")
    print(f"Overall Accuracy           : {accuracy:.1f}% ({passed_count}/{total})")
    print(f"Factual Extraction Accuracy: {pos_accuracy:.1f}% ({pos_pass}/{len(pos_tests)})")
    print(f"Hard Negative Rejection    : {rejection_rate:.1f}% ({neg_pass}/{len(neg_tests)})")
    print(f"Hallucination Rate         : {hallucination_rate:.2f}%")
    print(f"Mean Query Latency         : {mean_latency * 1000:.1f} ms")
    print("=" * 75 + "\n")


if __name__ == "__main__":
    run_benchmark()
