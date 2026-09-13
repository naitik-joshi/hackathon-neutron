"""Endpoint contract tests that do not require Ollama or network access."""

import json
import threading
import unittest
import urllib.error
import urllib.request

import api_server
from api_server import GroundedAnalysisAPIHandler, ThreadedHTTPServer
from config import HARD_NEGATIVE_RESPONSE
from ollama_bridge import ModelUnavailableError
from store import DocumentStore


class FakeBridge:
    def __init__(self):
        self.available = True

    def check_health(self):
        return self.available

    def query_section(self, _paper, _section, _text, question):
        if not self.available:
            raise ModelUnavailableError("offline")
        return (
            HARD_NEGATIVE_RESPONSE
            if "absent" in question.lower()
            else "Grounded answer from the requested section."
        )

    def query_comparison(self, *_args):
        if not self.available:
            raise ModelUnavailableError("offline")
        return "Grounded comparison of the requested sections."


class TestApiContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.store = DocumentStore()
        cls.store.add_or_update(
            "paper-one.txt",
            {
                "Header block": "Paper One",
                "Abstract": "Shared grounded research systems methods.",
                "Keywords": "grounded systems; research",
                "4. Results and Discussion": "The measured result was 10.",
            },
        )
        cls.store.add_or_update(
            "paper-two.txt",
            {
                "Header block": "Paper Two",
                "Abstract": "Shared grounded research evaluation.",
                "Keywords": "grounded systems; evaluation",
                "4. Results and Discussion": "The measured result was 20.",
            },
        )
        cls.bridge = FakeBridge()
        api_server.store = cls.store
        api_server.bridge = cls.bridge
        api_server.SERVER_API_KEY = "test_key_that_is_long_enough_for_contract"
        cls.server = ThreadedHTTPServer(("127.0.0.1", 0), GroundedAnalysisAPIHandler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base_url = f"http://127.0.0.1:{cls.server.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=2)

    def request(self, method, path, body=None, authenticated=True):
        headers = {"Content-Type": "application/json"}
        if authenticated:
            headers["X-API-Key"] = api_server.SERVER_API_KEY
        request = urllib.request.Request(
            self.base_url + path,
            data=json.dumps(body).encode() if body is not None else None,
            headers=headers,
            method=method,
        )
        try:
            response = urllib.request.urlopen(request, timeout=5)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            return response.status, json.loads(response.read().decode())

    def test_authentication_and_papers_contract(self):
        status, error = self.request("GET", "/api/papers", authenticated=False)
        self.assertEqual(status, 401)
        self.assertEqual(error["error"]["code"], "UNAUTHORIZED")
        status, payload = self.request("GET", "/api/papers")
        self.assertEqual(status, 200)
        self.assertEqual(payload["count"], 2)
        self.assertIn("sections", payload["papers"][0])

    def test_query_contract_and_hard_negative(self):
        for question, expected in (("What is studied?", False), ("Is this absent?", True)):
            status, payload = self.request(
                "POST",
                "/api/query",
                {"paper_name": "paper-one.txt", "section": "Abstract", "question": question},
            )
            self.assertEqual(status, 200)
            self.assertTrue(payload["is_grounded"])
            self.assertEqual(payload["hard_negative"], expected)

        status, payload = self.request(
            "POST",
            "/api/query",
            {"paper_name": "paper-one.txt", "section_name": "Abstract", "question": "What is studied?"},
        )
        self.assertEqual((status, payload["section_matched"]), (200, "Abstract"))

    def test_compare_contract(self):
        status, payload = self.request(
            "POST",
            "/api/compare",
            {"paper_1": "paper-one.txt", "paper_2": "paper-two.txt", "section": "Abstract", "question": "Compare them."},
        )
        self.assertEqual(status, 200)
        self.assertTrue(payload["is_grounded"])
        self.assertEqual(payload["section"], "Abstract")

    def test_recommend_is_deterministic_and_model_independent(self):
        self.bridge.available = False
        status, payload = self.request(
            "POST", "/api/recommend", {"current_paper": "paper-one.txt"}
        )
        self.bridge.available = True
        self.assertEqual(status, 200)
        self.assertFalse(payload["model_used"])
        self.assertEqual(payload["recommendation"]["paper_name"], "paper-two.txt")

    def test_model_offline_is_retryable_503(self):
        self.bridge.available = False
        status, health = self.request("GET", "/api/health", authenticated=False)
        self.assertEqual((status, health["status"]), (503, "degraded"))
        status, payload = self.request(
            "POST",
            "/api/query",
            {"paper_name": "paper-one.txt", "section": "Abstract", "question": "Question"},
        )
        self.bridge.available = True
        self.assertEqual(status, 503)
        self.assertEqual(payload["error"]["code"], "MODEL_UNAVAILABLE")
        self.assertTrue(payload["error"]["retryable"])

    def test_invalid_and_unavailable_inputs_are_explicit(self):
        status, payload = self.request("POST", "/api/query", {"paper_name": 7, "question": "x"})
        self.assertEqual((status, payload["error"]["code"]), (400, "INVALID_FIELD"))
        status, payload = self.request(
            "POST", "/api/query", {"paper_name": "missing.txt", "question": "x"}
        )
        self.assertEqual((status, payload["error"]["code"]), (404, "PAPER_NOT_FOUND"))
        status, payload = self.request(
            "POST",
            "/api/query",
            {"paper_name": "paper-one.txt", "section": "Funding", "question": "x"},
        )
        self.assertEqual((status, payload["error"]["code"]), (422, "SECTION_NOT_FOUND"))

    def test_pdf_header_title_ignores_journal_masthead(self):
        store = DocumentStore()
        store.add_or_update(
            "paper.pdf",
            {
                "Header block": (
                    "Islington Journal of Multidisciplinary Research Vol. 1\n"
                    "Original Research Article\n"
                    "DOI: 10.67556/example\n"
                    "A Grounded Research Title Across\n"
                    "Two Header Lines\n"
                    "Demo Researcher 1,*\n"
                    "1Islington College, Kathmandu, Nepal"
                )
            },
        )
        self.assertEqual(
            store.get_paper_title("paper.pdf"),
            "A Grounded Research Title Across Two Header Lines",
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)
