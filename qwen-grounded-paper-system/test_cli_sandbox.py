"""
Testing Method 3: End-to-End CLI User Journey Sandbox.
Simulates a multi-turn interactive session verifying:
1. Setting active paper context (use <paper>)
2. Multi-turn Q&A within that single paper
3. Cross-paper query interception and blocking
4. Thematic paper similarity discovery
5. Explicit multi-paper comparative analysis
"""

import subprocess
import sys

# Safe console output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def run_cli_sandbox():
    print("=" * 70)
    print("  TESTING METHOD 3: INTERACTIVE CLI JOURNEY SANDBOX")
    print("=" * 70)

    # Simulated sequence of interactive user commands
    user_inputs = [
        # 1. Inspect dataset
        "what are papers in it",
        # 2. Select paper
        "use sample_paper.docx",
        # 3. Query locked paper in plain english
        "4. Results and Discussion | What is the F1-Score of the system?",
        # 4. Attempt cross-paper access (must be blocked)
        "sample_paper_2.txt | 4. Results and Discussion | What is the latency?",
        # 5. Query similarity & next paper exploration
        "which paper should I explore next",
        # 6. Explicit cross-paper comparison
        "compare sample_paper.docx | sample_paper_2.txt | 4. Results and Discussion | What latency is reported in each document?",
        # 7. Exit
        "exit"
    ]

    stdin_payload = "\n".join(user_inputs) + "\n"

    print("\nExecuting interactive sandbox session...\n")
    proc = subprocess.run(
        [sys.executable, "main.py", "run"],
        input=stdin_payload,
        text=True,
        capture_output=True
    )

    stdout = proc.stdout
    print(stdout)

    # Assert key journey expectations
    assert "Active paper set to: 'sample_paper.docx'" in stdout, "Failed to lock active paper"
    assert "98.4%" in stdout, "Failed to extract F1-score"
    assert "[Boundary Protection Active]" in stdout, "Failed to block cross-paper access"
    assert "Grounded Recommendation Analysis" in stdout, "Failed to generate grounded recommendation"
    assert "Comparison received" in stdout, "Failed to execute comparative query"

    print("\n" + "=" * 70)
    print("  ALL SANDBOX JOURNEY CHECKS PASSED SUCCESSFULLY!")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    run_cli_sandbox()
