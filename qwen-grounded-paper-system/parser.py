"""
Document Ingestion & Section Parser.
Implements deterministic section segmentation for .docx, .txt, and .pdf documents
conforming to the Target Research Paper Template Schema in AGENTS.md.
"""

from pathlib import Path
import json
import re
from typing import Dict, List, Optional, Tuple

import docx
try:
    import pypdf
except ImportError:
    pypdf = None

from config import (
    CANONICAL_SECTIONS,
    SECTION_PATTERNS,
    OUTPUT_DIR,
)


class DocumentParser:
    """
    Deterministic section parser that breaks down incoming documents
    into canonical research paper sections.
    """

    @classmethod
    def match_section_header(cls, text: str) -> Optional[Tuple[str, str]]:
        """
        Check if a text line corresponds to a canonical section header.
        Returns (canonical_section_name, remaining_inline_text) if matched, else None.
        """
        trimmed = text.strip()
        if not trimmed:
            return None

        # Clean common markdown heading markers (e.g. '## 1. Introduction' -> '1. Introduction')
        cleaned = re.sub(r"^#+\s*", "", trimmed).strip()

        for canonical_name, pattern in SECTION_PATTERNS:
            match = pattern.search(cleaned)
            if match:
                # If matched at start of line
                if match.start() == 0:
                    remaining = cleaned[match.end():].strip()
                    # Strip leading colon, dash, or whitespace
                    remaining = re.sub(r"^[:\-\u2013\u2014]\s*", "", remaining).strip()
                    return canonical_name, remaining
        return None

    @classmethod
    def parse_docx(cls, file_path: Path) -> Dict[str, str]:
        """
        Extract text from a .docx file and segment it into canonical sections,
        preserving the visual order of paragraphs and tables.
        """
        from docx.text.paragraph import Paragraph
        from docx.table import Table

        doc = docx.Document(file_path)
        raw_items: List[str] = []

        for element in doc.element.body:
            if element.tag.endswith("p"):
                p = Paragraph(element, doc)
                txt = p.text.strip()
                if txt:
                    raw_items.append(txt)
            elif element.tag.endswith("tbl"):
                t = Table(element, doc)
                for row in t.rows:
                    row_texts = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if row_texts:
                        raw_items.append(" | ".join(row_texts))

        return cls._segment_items(raw_items)

    @classmethod
    def parse_txt(cls, file_path: Path) -> Dict[str, str]:
        """
        Extract text from a .txt file and segment into canonical sections.
        """
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            lines = [line.strip() for line in f.readlines()]
        raw_items = [line for line in lines if line]
        return cls._segment_items(raw_items)

    @classmethod
    def parse_pdf(cls, file_path: Path) -> Dict[str, str]:
        """
        Extract text from a .pdf file and segment into canonical sections.
        """
        if pypdf is None:
            raise ImportError("pypdf is required to parse PDF documents.")

        reader = pypdf.PdfReader(str(file_path))
        raw_items: List[str] = []
        for page in reader.pages:
            text = page.extract_text() or ""
            for line in text.split("\n"):
                line = line.strip()
                if line:
                    raw_items.append(line)

        return cls._segment_items(raw_items)

    @classmethod
    def _normalize_text(cls, text: str) -> str:
        """Normalize common Unicode characters into standard ASCII equivalents."""
        replacements = {
            "\u2013": "-",
            "\u2014": "--",
            "\u2018": "'",
            "\u2019": "'",
            "\u201c": '"',
            "\u201d": '"',
            "\u00a0": " ",
            "\ufffd": "-",
            "\ufb00": "ff",
            "\ufb01": "fi",
            "\ufb02": "fl",
            "\ufb03": "ffi",
            "\ufb04": "ffl",
        }
        for old, new in replacements.items():
            text = text.replace(old, new)
        return text

    @classmethod
    def _segment_items(cls, items: List[str]) -> Dict[str, str]:
        """
        Deterministically segment an ordered list of text lines/paragraphs
        into canonical sections.
        """
        sections: Dict[str, List[str]] = {}
        current_section = "Header block"
        sections[current_section] = []

        for item in items:
            norm_item = cls._normalize_text(item)
            matched = cls.match_section_header(norm_item)
            if matched:
                section_name, inline_content = matched
                current_section = section_name
                if current_section not in sections:
                    sections[current_section] = []
                if inline_content:
                    sections[current_section].append(inline_content)
            else:
                sections[current_section].append(norm_item)

        # Merge paragraph lists into unified strings
        result: Dict[str, str] = {}
        for sec, parts in sections.items():
            content = "\n\n".join(parts).strip()
            if content:
                result[sec] = content

        return result

    @classmethod
    def parse_file(cls, file_path: Path) -> Dict[str, str]:
        """
        Parse a document file (.docx, .txt, .pdf) and cache structured
        JSON and Markdown summaries in ./parsed_insights.
        """
        suffix = file_path.suffix.lower()
        if suffix == ".docx":
            sections = cls.parse_docx(file_path)
        elif suffix in [".txt", ".md"]:
            sections = cls.parse_txt(file_path)
        elif suffix == ".pdf":
            sections = cls.parse_pdf(file_path)
        else:
            raise ValueError(f"Unsupported file format: {suffix}")

        cls.cache_insights(file_path.stem, file_path.name, sections)
        return sections

    @classmethod
    def cache_insights(cls, stem: str, original_filename: str, sections: Dict[str, str]) -> None:
        """
        Export structured JSON and Markdown summaries to ./parsed_insights.
        """
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

        # 1. Structured JSON
        json_path = OUTPUT_DIR / f"{stem}.json"
        json_data = {
            "filename": original_filename,
            "section_count": len(sections),
            "sections_present": list(sections.keys()),
            "content": sections
        }
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)

        # 2. Markdown summary
        md_path = OUTPUT_DIR / f"{stem}.md"
        md_lines = [
            f"# Document Analysis Insight: {original_filename}",
            f"- **Extracted Sections**: {len(sections)}",
            f"- **Schema Compliance**: {', '.join(sections.keys())}",
            "",
            "---",
            ""
        ]
        for sec_name, sec_text in sections.items():
            md_lines.append(f"## {sec_name}")
            md_lines.append(sec_text)
            md_lines.append("")

        with open(md_path, "w", encoding="utf-8") as f:
            f.write("\n".join(md_lines))
