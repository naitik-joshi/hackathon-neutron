"""
Testing Method 2: Live In-Flight Dataset Mutation & Hot-Reload Test.
Verifies that when a document in ./watch_papers is modified or replaced:
1. watchdog dynamically catches the change.
2. DocumentStore is immediately re-indexed with the new values without restarting.
3. Ollama queries reflect the new updated facts immediately.
"""

from pathlib import Path
import sys
import time

# Safe console output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from config import WATCH_DIR
from store import DocumentStore
from watcher import PaperWatcher
from ollama_bridge import GroundedOllamaBridge


def run_live_mutation_test():
    print("=" * 70)
    print("  TESTING METHOD 2: LIVE DATASET MUTATION & HOT-RELOAD")
    print("=" * 70)

    store = DocumentStore()
    watcher = PaperWatcher(store, watch_dir=WATCH_DIR)
    watcher.scan_existing_files()
    watcher.start()
    bridge = GroundedOllamaBridge()

    time.sleep(1.0)
    mutation_file = WATCH_DIR / "live_mutation_test.txt"

    try:
        # Phase 1: Create initial version
        print("\n[Phase 1] Creating new document: live_mutation_test.txt (Metric: 82.4%)...")
        v1_content = (
            "Title: Live Ingestion Mutation Experiment\n\n"
            "Abstract\n"
            "Initial abstract version for testing hot reload.\n\n"
            "4. Results and Discussion\n"
            "The initial measured benchmark score was 82.4% accuracy.\n\n"
            "5. Conclusion\n"
            "Initial conclusion."
        )
        with open(mutation_file, "w", encoding="utf-8") as f:
            f.write(v1_content)

        time.sleep(2.0)

        # Assert v1 is in store
        p, s, text = store.get_section_text("live_mutation_test.txt", "4. Results and Discussion")
        assert text is not None and "82.4%" in text, "Phase 1 Failed: v1 text was not indexed"
        print("  -> Phase 1 Passed: File detected and indexed with metric '82.4%'.")

        # Query Ollama on v1
        ans1 = bridge.query_section("live_mutation_test.txt", s, text, "What was the measured benchmark score?")
        print(f"  -> Ollama Response on v1: {ans1.strip()}")
        assert "82.4%" in ans1, "Ollama did not extract v1 metric 82.4%"

        # Phase 2: Live In-Flight Mutation (Update dataset without restarting)
        print("\n[Phase 2] Mutating document in-place (Metric updated to 99.7%)...")
        v2_content = (
            "Title: Live Ingestion Mutation Experiment (Revised)\n\n"
            "Abstract\n"
            "Updated abstract version after hyperparameter tuning.\n\n"
            "4. Results and Discussion\n"
            "Following parameter optimization, the measured benchmark score reached 99.7% accuracy.\n\n"
            "5. Conclusion\n"
            "Updated conclusion."
        )
        with open(mutation_file, "w", encoding="utf-8") as f:
            f.write(v2_content)

        time.sleep(2.0)

        # Assert v2 is dynamically hot-reloaded into store
        p, s, text2 = store.get_section_text("live_mutation_test.txt", "4. Results and Discussion")
        assert text2 is not None and "99.7%" in text2, "Phase 2 Failed: v2 text was not hot-reloaded"
        assert "82.4%" not in text2, "Stale v1 data lingered in store"
        print("  -> Phase 2 Passed: In-memory store dynamically updated to '99.7%'.")

        # Query Ollama on v2
        ans2 = bridge.query_section("live_mutation_test.txt", s, text2, "What was the measured benchmark score?")
        print(f"  -> Ollama Response on v2: {ans2.strip()}")
        assert "99.7%" in ans2, "Ollama did not reflect updated metric 99.7%"

        print("\n" + "=" * 70)
        print("  ALL LIVE MUTATION TESTS PASSED: DATASET UPDATES ITSELF DYNAMICALLY!")
        print("=" * 70 + "\n")

    finally:
        # Phase 3: Cleanup and verify store pruning
        print("[Phase 3] Cleaning up test file...")
        if mutation_file.exists():
            mutation_file.unlink()
        time.sleep(1.5)
        watcher.stop()
        assert "live_mutation_test.txt" not in store.list_papers(), "File was not pruned on deletion"
        print("  -> Phase 3 Passed: Store correctly pruned deleted file.\n")


if __name__ == "__main__":
    run_live_mutation_test()
