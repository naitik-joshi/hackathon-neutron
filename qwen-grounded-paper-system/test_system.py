"""
Comprehensive automated test suite for the Closed-Domain Grounded Document Analysis System.
Validates:
1. Deterministic Section Parsing for .docx and .txt.
2. Insights caching (JSON and Markdown) in ./parsed_insights.
3. Thread-safe DocumentStore lookup.
4. Watchdog live directory detection and dynamic in-memory syncing.
5. Grounded Ollama Bridge:
   - Positive grounded extraction.
   - Hard negative response on absent claims.
   - Strict section isolation.
"""

import time
import unittest
from pathlib import Path

from config import (
    WATCH_DIR,
    OUTPUT_DIR,
    HARD_NEGATIVE_RESPONSE,
    CANONICAL_SECTIONS,
)
from parser import DocumentParser
from store import DocumentStore
from watcher import PaperWatcher
from ollama_bridge import GroundedOllamaBridge


class TestGroundedDocumentAnalysis(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.store = DocumentStore()
        cls.watcher = PaperWatcher(cls.store, watch_dir=WATCH_DIR)
        cls.bridge = GroundedOllamaBridge()
        cls.watcher.scan_existing_files()
        cls.watcher.start()
        # Give watchdog observer time to spin up
        time.sleep(1.0)

    @classmethod
    def tearDownClass(cls):
        cls.watcher.stop()

    def test_01_parser_docx_schema_compliance(self):
        sample_path = WATCH_DIR / "sample_paper.docx"
        self.assertTrue(sample_path.exists(), "sample_paper.docx should exist in watch_papers")
        sections = DocumentParser.parse_file(sample_path)

        # Verify key template sections from AGENTS.md
        required_sections = [
            "Header block",
            "Abstract",
            "Keywords",
            "1. Introduction",
            "2. Literature and Related Work",
            "3. Methodology / Approach",
            "4. Results and Discussion",
            "5. Conclusion",
            "Disclosure Statement",
            "Ethical Approval",
            "Data Availability Statement",
            "Use of Artificial Intelligence (AI) Tools",
            "Authors’ Contributions",
            "Funding",
            "Competing Interests",
            "Acknowledgements",
            "References",
        ]
        for sec in required_sections:
            self.assertIn(sec, sections, f"Section '{sec}' must be parsed from sample_paper.docx")

    def test_02_cached_insights_files(self):
        json_path = OUTPUT_DIR / "sample_paper.json"
        md_path = OUTPUT_DIR / "sample_paper.md"
        self.assertTrue(json_path.exists(), "sample_paper.json must exist in parsed_insights")
        self.assertTrue(md_path.exists(), "sample_paper.md must exist in parsed_insights")
        self.assertGreater(json_path.stat().st_size, 1000)
        self.assertGreater(md_path.stat().st_size, 1000)

    def test_03_store_lookup_and_normalization(self):
        # Test exact match
        p, s, text = self.store.get_section_text("sample_paper.docx", "4. Results and Discussion")
        self.assertIsNotNone(p)
        self.assertEqual(s, "4. Results and Discussion")
        self.assertIn("96.8%", text)

        # Test normalized section lookup (e.g. without numeric prefix)
        p, s, text = self.store.get_section_text("sample_paper", "Results and Discussion")
        self.assertIsNotNone(p)
        self.assertEqual(s, "4. Results and Discussion")
        self.assertIn("96.8%", text)

    def test_04_watchdog_live_dynamic_sync(self):
        # Create a dynamic test paper file
        dynamic_file = WATCH_DIR / "temp_live_test.txt"
        content = (
            "Title: Dynamic Live Watchdog Test Paper\n\n"
            "Abstract\n"
            "This paper verifies dynamic live indexing via watchdog.\n\n"
            "1. Introduction\n"
            "This is the dynamic test introduction section with unique token DELTA-99.\n\n"
            "5. Conclusion\n"
            "Watchdog dynamic sync succeeded.\n\n"
            "References\n"
            "Test, A. (2026). Dynamic Watcher. Journal of Tests, 1(1), pp. 1-2."
        )
        try:
            with open(dynamic_file, "w", encoding="utf-8") as f:
                f.write(content)

            # Allow watchdog to catch and process event
            time.sleep(2.0)

            # Check store
            papers = self.store.list_papers()
            self.assertIn("temp_live_test.txt", papers, "Dynamically dropped file must be indexed without restart")

            p, s, text = self.store.get_section_text("temp_live_test.txt", "1. Introduction")
            self.assertIsNotNone(text)
            self.assertIn("DELTA-99", text)

        finally:
            if dynamic_file.exists():
                dynamic_file.unlink()
            time.sleep(1.5)
            self.assertNotIn("temp_live_test.txt", self.store.list_papers(), "Deleted file should be removed from store")

    def test_05_grounded_positive_query(self):
        p, s, text = self.store.get_section_text("sample_paper.docx", "4. Results and Discussion")
        response = self.bridge.query_section(
            paper_name=p,
            section_name=s,
            section_text=text,
            question="What was the measured hallucination rate of Our Grounded System in Table 1?"
        )
        self.assertIn("0.00%", response)

    def test_06_hard_negative_absent_claim(self):
        p, s, text = self.store.get_section_text("sample_paper.docx", "4. Results and Discussion")
        response = self.bridge.query_section(
            paper_name=p,
            section_name=s,
            section_text=text,
            question="What GPU model was used to run the training benchmarks?"
        )
        self.assertEqual(response.strip(), HARD_NEGATIVE_RESPONSE)

    def test_07_section_isolation_boundary(self):
        # Asking for F1-Score (which is in Section 4) while isolating Section 1
        p, s, text = self.store.get_section_text("sample_paper.docx", "1. Introduction")
        response = self.bridge.query_section(
            paper_name=p,
            section_name=s,
            section_text=text,
            question="What is the measured F1-Score of the system?"
        )
        self.assertEqual(response.strip(), HARD_NEGATIVE_RESPONSE)


if __name__ == "__main__":
    unittest.main(verbosity=2)
