"""
Configuration and constants for the Closed-Domain Grounded Document Analysis System.
Adheres strictly to AGENTS.md rules and Target Research Paper Template Schema.
"""

from pathlib import Path
import re

# Workspace Directories
BASE_DIR = Path(__file__).resolve().parent
WATCH_DIR = BASE_DIR / "watch_papers"
OUTPUT_DIR = BASE_DIR / "parsed_insights"

# Ensure directories exist
WATCH_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Local Ollama Configuration
OLLAMA_BASE_URL = "http://127.0.0.1:11434"
MODEL_NAME = "qwen2.5:3b"
TEMPERATURE = 0.0

# Mandatory Grounding Response
HARD_NEGATIVE_RESPONSE = "Information not available in the provided document(s)."

# Canonical Schema Sections in Hierarchical Order as defined in AGENTS.md
CANONICAL_SECTIONS = [
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
    "Consent to Participate",
    "Consent to Publish",
    "Consent to Participate / Consent to Publish",
    "Data Availability Statement",
    "Use of Artificial Intelligence (AI) Tools",
    "Authors’ Contributions",
    "Funding",
    "Competing Interests",
    "Acknowledgements",
    "References",
]

# Regex patterns for deterministic section heading detection
# Matches both numbered and unnumbered variations, case-insensitively
SECTION_PATTERNS = [
    ("Abstract", re.compile(r"^(?:Abstract)\b[:\s]*$", re.IGNORECASE)),
    ("Keywords", re.compile(r"^(?:Keywords?)\b[:\s]*", re.IGNORECASE)),
    ("1. Introduction", re.compile(r"^(?:1\.?\s*)?Introduction\b[:\s]*$", re.IGNORECASE)),
    ("2. Literature and Related Work", re.compile(r"^(?:2\.?\s*)?(?:Literature\s*(?:and|&)\s*Related\s*Work|Related\s*Work|Literature\s*Review)\b[:\s]*$", re.IGNORECASE)),
    ("3. Methodology / Approach", re.compile(r"^(?:3\.?\s*)?(?:Methodology\s*(?:/|and|&)?\s*Approach|Methodology|Methods?)\b[:\s]*$", re.IGNORECASE)),
    ("4. Results and Discussion", re.compile(r"^(?:4\.?\s*)?(?:Results\s*(?:and|&)\s*Discussion|Results|Discussion)\b[:\s]*$", re.IGNORECASE)),
    ("5. Conclusion", re.compile(r"^(?:5\.?\s*)?(?:Conclusions?|Concluding\s*Remarks)\b[:\s]*$", re.IGNORECASE)),
    ("Disclosure Statement", re.compile(r"^(?:Disclosure\s*Statement|Disclosures?)\b[:\s]*$", re.IGNORECASE)),
    ("Ethical Approval", re.compile(r"^(?:Ethical\s*Approval(?:s)?|Ethics\s*(?:Approval|Statement))\b[:\s]*", re.IGNORECASE)),
    ("Consent to Participate / Consent to Publish", re.compile(r"^(?:Consent\s*to\s*(?:Participate|Publish)(?:\s*(?:/|and)\s*Consent\s*to\s*(?:Participate|Publish))?)\b[:\s]*", re.IGNORECASE)),
    ("Consent to Participate", re.compile(r"^(?:Consent\s*to\s*Participate)\b[:\s]*", re.IGNORECASE)),
    ("Consent to Publish", re.compile(r"^(?:Consent\s*to\s*Publish)\b[:\s]*", re.IGNORECASE)),
    ("Data Availability Statement", re.compile(r"^(?:Data\s*Availability\s*Statement|Data\s*Availability)\b[:\s]*", re.IGNORECASE)),
    ("Use of Artificial Intelligence (AI) Tools", re.compile(r"^(?:Use\s*of\s*(?:Artificial\s*Intelligence\s*\(AI\)\s*Tools|AI\s*Tools|Generative\s*AI))\b[:\s]*", re.IGNORECASE)),
    ("Authors’ Contributions", re.compile(r"^(?:Authors[’']?\s*Contributions?|Author\s*Contributions?)\b[:\s]*", re.IGNORECASE)),
    ("Funding", re.compile(r"^(?:Funding(?:\s*Information)?|Financial\s*Support)\b[:\s]*", re.IGNORECASE)),
    ("Competing Interests", re.compile(r"^(?:Competing\s*Interests?|Conflicts?\s*of\s*Interest)\b[:\s]*", re.IGNORECASE)),
    ("Acknowledgements", re.compile(r"^(?:Acknowledgements?)\b[:\s]*$", re.IGNORECASE)),
    ("References", re.compile(r"^(?:References?|Bibliography)\b[:\s]*$", re.IGNORECASE)),
]
