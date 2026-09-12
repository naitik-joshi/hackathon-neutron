"""
Main CLI Application for the Closed-Domain Grounded Document Analysis System.
Provides live watchdog tracking, in-memory indexing, and strict grounded Ollama querying.
"""

import argparse
import sys
import time
import re

# Ensure safe console output across all Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from config import (
    WATCH_DIR,
    OUTPUT_DIR,
    HARD_NEGATIVE_RESPONSE,
)
from store import DocumentStore
from watcher import PaperWatcher
from ollama_bridge import GroundedOllamaBridge


def parse_query_pattern(query_str: str):
    """
    Parse pattern:
    - 3 parts: <paper_name> | <section_name> | <question>
    - 2 parts: <section_name> | <question> (for active paper session)
    """
    parts = [p.strip() for p in query_str.split("|")]
    if len(parts) == 3:
        return parts[0], parts[1], parts[2]
    elif len(parts) == 2:
        return None, parts[0], parts[1]
    return None, None, None


def execute_query(store: DocumentStore, bridge: GroundedOllamaBridge, paper_query: str, section_query: str, question: str) -> None:
    """Execute a single grounded query adhering strictly to AGENTS.md rules."""
    print("\n" + "=" * 70)
    print(f"QUERY EXECUTION")
    print(f"Target Paper   : {paper_query}")
    print(f"Target Section : {section_query}")
    print(f"Question       : {question}")
    print("=" * 70)

    # Retrieve isolated section text
    resolved_paper, resolved_section, section_text = store.get_section_text(paper_query, section_query)

    if not resolved_paper:
        print(f"\n[Warning] Paper '{paper_query}' was not found in the index.")
        print(f"Indexed papers: {store.list_papers() or 'None'}")
        print(f"\nResponse:\n{HARD_NEGATIVE_RESPONSE}")
        return

    if not resolved_section or not section_text:
        print(f"\n[Warning] Section '{section_query}' was not found in paper '{resolved_paper}'.")
        print(f"Available sections: {store.list_sections(resolved_paper)}")
        print(f"\nResponse:\n{HARD_NEGATIVE_RESPONSE}")
        return

    print(f"[Grounding Boundary] Isolated section text ({len(section_text)} chars) from '{resolved_paper}' -> '{resolved_section}'")

    # Send to zero-temperature Ollama bridge with hard negative constraint
    start_time = time.time()
    response = bridge.query_section(
        paper_name=resolved_paper,
        section_name=resolved_section,
        section_text=section_text,
        question=question
    )
    elapsed = time.time() - start_time

    print(f"[Ollama Inference] Response received in {elapsed:.2f}s:")
    print("-" * 70)
    print(response)
    print("-" * 70)


def execute_comparison(store: DocumentStore, bridge: GroundedOllamaBridge, paper1_query: str, paper2_query: str, section_query: str, question: str) -> None:
    """Execute grounded comparison across two papers strictly when explicitly requested."""
    print("\n" + "=" * 70)
    print("EXPLICIT CROSS-PAPER COMPARATIVE QUERY")
    print(f"Paper 1        : {paper1_query}")
    print(f"Paper 2        : {paper2_query}")
    print(f"Section Target : {section_query}")
    print(f"Question       : {question}")
    print("=" * 70)

    rp1, rs1, text1 = store.get_section_text(paper1_query, section_query)
    rp2, rs2, text2 = store.get_section_text(paper2_query, section_query)

    if not rp1 or not text1:
        print(f"[Warning] Section '{section_query}' not found in Paper 1 '{paper1_query}'.")
    if not rp2 or not text2:
        print(f"[Warning] Section '{section_query}' not found in Paper 2 '{paper2_query}'.")

    start_time = time.time()
    response = bridge.query_comparison(
        paper1_name=rp1 or paper1_query,
        section1_text=text1,
        paper2_name=rp2 or paper2_query,
        section2_text=text2,
        section_name=rs1 or rs2 or section_query,
        question=question
    )
    elapsed = time.time() - start_time
    print(f"[Ollama Inference] Comparison received in {elapsed:.2f}s:")
    print("-" * 70)
    print(response)
    print("-" * 70)


def repl_loop(store: DocumentStore, bridge: GroundedOllamaBridge) -> None:
    """Interactive CLI loop with strict single active paper context isolation."""
    print("\n" + "=" * 70)
    print("  CLOSED-DOMAIN GROUNDED RESEARCH PAPER ANALYSIS SYSTEM")
    print("=" * 70)
    print("Single-Paper Session Context:")
    print("  Once a paper is active, questions are strictly locked to that paper only.")
    print("  Cross-paper contamination is blocked unless explicit comparison is requested.")
    print("\nSupported Commands:")
    print("  use <paper_name>               - Lock context to a single research paper")
    print("  clear_paper                    - Unlock active paper context")
    print("  similar [paper_name]           - Find related papers by keyword/abstract overlap")
    print("  compare <p1>|<p2>|<sec>|<q>    - Explicit cross-paper comparison")
    print("  list                           - List all indexed papers")
    print("  sections [paper_name]          - List sections present in paper")
    print("  show [paper] | <section>       - View isolated raw text of a section")
    print("  help                           - Show command guidance")
    print("  exit / quit                    - Exit the system")
    print("=" * 70 + "\n")

    active_paper: str = None

    while True:
        try:
            prompt_prefix = f"[{active_paper}] query> " if active_paper else "query> "
            line = input(prompt_prefix).strip()
        except (KeyboardInterrupt, EOFError):
            print("\nExiting.")
            break

        if not line:
            continue

        cmd_lower = line.lower()
        if cmd_lower in ["exit", "quit", "q"]:
            print("Shutting down.")
            break

        elif cmd_lower == "list":
            papers = store.list_papers()
            print(f"\nCurrently Indexed Papers ({len(papers)}):")
            for p in papers:
                secs = store.list_sections(p)
                marker = " [ACTIVE]" if active_paper and p == active_paper else ""
                print(f"  * {p}{marker} ({len(secs)} sections)")
            print()
            continue

        elif cmd_lower.startswith("use ") or cmd_lower.startswith("select ") or cmd_lower.startswith("switch "):
            target = line.split(" ", 1)[1].strip()
            resolved = store.resolve_paper_key(target)
            if resolved:
                active_paper = resolved
                secs = store.list_sections(active_paper)
                print(f"[Context Locked] Active paper set to: '{active_paper}' ({len(secs)} sections).")
                print(f"You can now query directly using: <section_name> | <question>\n")
            else:
                print(f"[Error] Paper '{target}' not found. Type 'list' to see available papers.\n")
            continue

        elif cmd_lower in ["clear_paper", "unfocus", "clear"]:
            if active_paper:
                print(f"[Context Released] Unlocked active paper '{active_paper}'.\n")
                active_paper = None
            else:
                print("No active paper was set.\n")
            continue

        # Natural language / command: Paper Inventory
        elif any(k in cmd_lower for k in ["what are papers in it", "what papers are in it", "what papers in it", "what papers do you have", "what papers are there", "available papers", "list papers", "show papers"]):
            papers = store.list_papers()
            print(f"\nPapers Currently Ingested in Dataset ({len(papers)}):")
            for p in papers:
                title = ""
                _, _, header = store.get_section_text(p, "Header block")
                if header:
                    lines = [ln.strip() for ln in header.split("\n") if ln.strip()]
                    title = lines[0] if lines else ""
                marker = " [ACTIVE]" if active_paper and p == active_paper else ""
                print(f"  * {p}{marker}")
                if title and title != p:
                    print(f"    Title: \"{title}\"")
            print(f"\nTo focus on any paper, simply type: use <paper_name>\n")
            continue

        # Natural language / command: Similarity & Next Paper Recommendations
        elif any(k in cmd_lower for k in [
            "what are similar paper", "similar paper", "similar to it", "papers like this",
            "which paper should i explore next", "what should i explore next", "what should i read next",
            "recommend next", "explore next", "suggest next"
        ]) or cmd_lower.startswith("similar"):
            parts = line.split(" ", 1)
            target = parts[1].strip() if len(parts) > 1 and not any(w in parts[1].lower() for w in ["to", "it", "paper", "should", "next"]) else active_paper
            if not target:
                print("No active paper selected. First select a paper with: use <paper_name>\n")
                continue

            resolved_target = store.resolve_paper_key(target) or target
            matches = store.find_similar_papers(resolved_target)

            candidates = []
            for other_p, score, shared in matches:
                if other_p == resolved_target or other_p == target:
                    continue
                _, _, abst = store.get_section_text(other_p, "Abstract")
                _, _, header = store.get_section_text(other_p, "Header block")
                title = header.split("\n")[0].strip() if header else other_p
                if abst:
                    candidates.append((other_p, title, score, shared, abst))
                if len(candidates) >= 3:
                    break

            # Fallback if no direct keyword matches, suggest other available papers in dataset
            if not candidates:
                for other_p in store.list_papers():
                    if other_p != resolved_target and other_p != target:
                        _, _, abst = store.get_section_text(other_p, "Abstract")
                        _, _, header = store.get_section_text(other_p, "Header block")
                        title = header.split("\n")[0].strip() if header else other_p
                        if abst:
                            candidates.append((other_p, title, 0.0, [], abst))
                        if len(candidates) >= 3:
                            break

            _, _, curr_abst = store.get_section_text(resolved_target, "Abstract")
            print(f"\n[Grounded Recommendation Analysis for '{resolved_target}']")
            print("Evaluating candidate papers in current dataset...")
            rec = bridge.generate_grounded_recommendation(resolved_target, curr_abst or "", candidates)
            print("-" * 70)
            print(rec)
            print("-" * 70)
            print(f"\nTo switch to any recommended paper, type: use <paper_name>\n")
            continue

        elif cmd_lower.startswith("compare "):
            payload = line[8:].strip()
            parts = [p.strip() for p in payload.split("|")]
            if len(parts) == 4:
                execute_comparison(store, bridge, parts[0], parts[1], parts[2], parts[3])
            else:
                print("[Error] Compare syntax must be: compare <paper1> | <paper2> | <section> | <question>")
                print("Example: compare sample_paper.docx | sample_paper_2.txt | 4. Results and Discussion | Compare the reported latency.")
            continue

        elif cmd_lower.startswith("show "):
            sub = line[5:].strip()
            parts = [p.strip() for p in sub.split("|")]
            if len(parts) == 2:
                rp, rs, text = store.get_section_text(parts[0], parts[1])
            elif len(parts) == 1 and active_paper:
                rp, rs, text = store.get_section_text(active_paper, parts[0])
            else:
                print("Usage: show [paper_name] | <section_name>")
                continue

            if text:
                print(f"\n--- Raw Text for [{rp} -> {rs}] ---")
                print(text)
                print("--- End Raw Text ---\n")
            else:
                print(f"Section not found in '{rp or 'active paper'}'. Use 'sections' to inspect.")
            continue

        elif cmd_lower == "help":
            print("\nExpected Query Patterns:")
            if active_paper:
                print(f"  Active Paper is: {active_paper}")
                print("  Query Pattern  : <section_name> | <question>")
                print("  Example        : 4. Results and Discussion | What is the F1-Score of the system?")
                print("  Switch Paper   : use <other_paper_name>")
                print("  Find Similar   : similar")
            else:
                print("  Query Pattern  : <paper_name> | <section_name> | <question>")
                print("  Example        : sample_paper.docx | 4. Results and Discussion | What is the F1-Score?")
                print("  Lock Paper     : use <paper_name>")
            print("  Compare Papers : compare <paper1> | <paper2> | <section> | <question>\n")
            continue

        paper, section, question = parse_query_pattern(line)

        # Smart fallback if user didn't use '|' syntax (e.g. "what is the main highlight of IJMR Volume 1")
        if not section or not question:
            target_paper = active_paper

            # Check if any indexed paper is mentioned in the line
            for p in store.list_papers():
                stem = p.rsplit(".", 1)[0]
                norm_stem = re.sub(r"[\s_\-+\.\(\)]+", " ", stem.lower())
                norm_line = re.sub(r"[\s_\-+\.\(\)]+", " ", line.lower())
                parts = [w for w in norm_stem.split() if len(w) > 2]
                if norm_stem in norm_line or (parts and all(w in norm_line for w in parts[:2])):
                    target_paper = p
                    break

            if not target_paper:
                resolved = store.resolve_paper_key(line)
                if resolved:
                    active_paper = resolved
                    print(f"[Context Locked] Active paper set to: '{active_paper}'.")
                    print(f"You can now query directly using: <section_name> | <question> or ask a question.\n")
                    continue

                print("[Error] No active paper selected.")
                print("Options:")
                print("  1. Lock to a paper: use <paper_name>")
                print("  2. Standard syntax: <paper_name> | <section_name> | <question>")
                print(f"Available papers: {', '.join(store.list_papers())}\n")
                continue

            # Detect if a specific section is mentioned in the query, else default to 'Abstract'
            matched_section = None
            for sec in store.list_sections(target_paper):
                sec_norm = re.sub(r"^[0-9]+\.?\s*", "", sec.lower())
                if sec_norm in line.lower():
                    matched_section = sec
                    break

            if not matched_section:
                matched_section = "Abstract"

            paper = target_paper
            section = matched_section
            question = line

            if active_paper != target_paper:
                active_paper = target_paper
                print(f"[Context Locked] Session locked to active paper: '{active_paper}'.")
            print(f"[Auto-Routed Query] Target: '{paper}' | Section: '{section}'")

        # Single active paper isolation logic for structured syntax
        elif not paper:
            if not active_paper:
                print("[Error] No active paper selected. Provide format: <paper_name> | <section_name> | <question>")
                print("Or lock to a paper first using: use <paper_name>")
                continue
            paper = active_paper
        else:
            resolved_input = store.resolve_paper_key(paper)
            if active_paper and resolved_input and resolved_input != active_paper:
                print(f"\n[Boundary Protection Active]")
                print(f"Current session context is strictly locked to: '{active_paper}'.")
                print(f"Cross-paper access to '{resolved_input}' is blocked to prevent context contamination.")
                print(f"To focus on '{resolved_input}', please switch explicitly:")
                print(f"  use {resolved_input}\n")
                continue
            elif not active_paper and resolved_input:
                active_paper = resolved_input
                print(f"[Context Locked] Session locked to '{active_paper}'. Subsequent queries can use '<section> | <question>'.")

        execute_query(store, bridge, paper, section, question)


def main() -> None:
    parser = argparse.ArgumentParser(description="Automated Closed-Domain Document Analysis System")
    subparsers = parser.add_subparsers(dest="mode", help="Execution mode")

    # Mode: run (watcher + interactive REPL)
    subparsers.add_parser("run", help="Start directory watcher and open interactive CLI")

    # Mode: watch (watcher only)
    subparsers.add_parser("watch", help="Start directory watcher in foreground")

    # Mode: query (single shot)
    query_parser = subparsers.add_parser("query", help="Execute single query")
    query_parser.add_argument("query_string", type=str, help="Format: '<paper> | <section> | <question>'")

    # Mode: list
    subparsers.add_parser("list", help="Scan and list indexed papers and sections")

    args = parser.parse_args()
    mode = args.mode or "run"

    # Initialize components
    store = DocumentStore()
    watcher = PaperWatcher(store, watch_dir=WATCH_DIR)
    bridge = GroundedOllamaBridge()

    # Initial scan
    print(f"Scanning '{WATCH_DIR}' for existing documents...")
    count = watcher.scan_existing_files()
    print(f"Loaded {count} documents into in-memory store.")

    if mode == "list":
        papers = store.list_papers()
        print(f"\nIndexed Papers ({len(papers)}):")
        for p in papers:
            print(f"\n[Paper] {p}")
            for s in store.list_sections(p):
                print(f"   |-- {s}")
        return

    if mode == "watch":
        watcher.start()
        print("Running watcher in foreground. Press Ctrl+C to stop.")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            watcher.stop()
        return

    if mode == "query":
        paper, section, question = parse_query_pattern(args.query_string)
        if not paper:
            print("[Error] Query string must match format: '<paper_name> | <section_name> | <question>'")
            sys.exit(1)
        execute_query(store, bridge, paper, section, question)
        return

    if mode == "run":
        # Start watcher in background
        watcher.start()
        try:
            repl_loop(store, bridge)
        finally:
            watcher.stop()


if __name__ == "__main__":
    main()
