"""
In-memory runtime store indexed by filename and section name.
Thread-safe for dynamic synchronization with live watchdog events.
"""

from threading import RLock
from typing import Dict, List, Optional, Tuple
import re


class DocumentStore:
    """
    Thread-safe in-memory document store.
    Hierarchy: filename -> { section_name -> section_content }
    """

    def __init__(self) -> None:
        self._lock = RLock()
        # Storage: { canonical_filename: { canonical_section: content } }
        self._documents: Dict[str, Dict[str, str]] = {}

    def add_or_update(self, filename: str, sections: Dict[str, str]) -> None:
        """Add or update an indexed document."""
        with self._lock:
            self._documents[filename] = dict(sections)

    def remove(self, filename: str) -> bool:
        """Remove a document from the index."""
        with self._lock:
            # Check exact match
            if filename in self._documents:
                del self._documents[filename]
                return True
            # Check without extension
            for key in list(self._documents.keys()):
                if key.lower() == filename.lower() or key.lower().startswith(filename.lower() + "."):
                    del self._documents[key]
                    return True
            return False

    def list_papers(self) -> List[str]:
        """List all indexed paper filenames."""
        with self._lock:
            return list(self._documents.keys())

    def resolve_paper_key(self, paper_query: Optional[str]) -> Optional[str]:
        """Resolve a queried paper name to an indexed key with flexible delimiter matching."""
        if not paper_query or not str(paper_query).strip():
            return None

        target = str(paper_query).strip().lower()
        norm_target = re.sub(r"[\s_\-+\.\(\)]+", " ", target).strip()

        with self._lock:
            # 1. Exact or stem match
            for key in self._documents.keys():
                kl = key.lower()
                if kl == target:
                    return key
                if kl.split(".")[0] == target.split(".")[0]:
                    return key

            # 2. Normalized substring match (ignoring underscores/spaces)
            for key in self._documents.keys():
                norm_key = re.sub(r"[\s_\-+\.\(\)]+", " ", key.lower()).strip()
                if norm_target in norm_key or norm_key in norm_target:
                    return key

            # 3. Token-based match (e.g. all words in target are in key)
            target_words = [w for w in norm_target.split() if len(w) > 1]
            if target_words:
                for key in self._documents.keys():
                    norm_key = re.sub(r"[\s_\-+\.\(\)]+", " ", key.lower()).strip()
                    if all(w in norm_key for w in target_words):
                        return key

        return None

    def list_sections(self, paper_query: str) -> List[str]:
        """List available sections for a specific paper."""
        with self._lock:
            key = self.resolve_paper_key(paper_query)
            if key and key in self._documents:
                return list(self._documents[key].keys())
        return []

    def get_section_names(self, paper_query: str) -> List[str]:
        """Alias for list_sections."""
        return self.list_sections(paper_query)

    def get_paper_title(self, paper_query: str) -> str:
        """Extract document title from Header block or fallback to filename."""
        with self._lock:
            key = self.resolve_paper_key(paper_query)
            if not key or key not in self._documents:
                return paper_query or "Untitled Document"
            doc = self._documents[key]
            header = doc.get("Header block", "")
            if header:
                lines = [line.strip() for line in header.split("\n") if line.strip()]
                if lines:
                    return lines[0]
            return key.rsplit(".", 1)[0].replace("_", " ")

    def resolve_section_key(self, doc_sections: Dict[str, str], section_query: str) -> Optional[str]:
        """
        Resolve user query for a section to the document's indexed section key.
        Handles numeric prefixes, spaces, slashes, and case variation.
        """
        target = section_query.strip().lower()
        target_norm = re.sub(r"^[0-9]+\.?\s*", "", target)  # strip e.g. "1. "

        for sec in doc_sections.keys():
            sl = sec.lower()
            if sl == target:
                return sec
            sl_norm = re.sub(r"^[0-9]+\.?\s*", "", sl)
            if sl_norm == target_norm:
                return sec
            if target_norm and target_norm in sl_norm:
                return sec

        return None

    def get_section_text(self, paper_query: str, section_query: str) -> Tuple[Optional[str], Optional[str], Optional[str]]:
        """
        Retrieve isolated section text.
        Returns: (resolved_paper_name, resolved_section_name, section_text)
        If paper is not found, returns (None, None, None).
        If section is not found in paper, returns (resolved_paper_name, None, None).
        """
        with self._lock:
            paper_key = self.resolve_paper_key(paper_query)
            if not paper_key:
                return None, None, None

            doc_sections = self._documents[paper_key]
            section_key = self.resolve_section_key(doc_sections, section_query)
            if not section_key:
                return paper_key, None, None

            return paper_key, section_key, doc_sections[section_key]

    def find_similar_papers(self, target_paper_query: str) -> List[Tuple[str, float, List[str]]]:
        """
        Find indexed papers that share keywords or thematic concepts with the target paper.
        Returns a list of tuples: (matched_paper_name, similarity_score, common_terms)
        """
        with self._lock:
            target_key = self.resolve_paper_key(target_paper_query)
            if not target_key:
                return []

            target_doc = self._documents[target_key]

            def extract_tokens(doc: Dict[str, str]) -> set:
                tokens = set()
                # 1. Keywords
                for k in ["Keywords", "Keywords:"]:
                    resolved_k = self.resolve_section_key(doc, k)
                    if resolved_k and resolved_k in doc:
                        raw = doc[resolved_k].lower()
                        parts = re.split(r"[;,]+", raw)
                        for p in parts:
                            cleaned = re.sub(r"[^\w\s-]", "", p).strip()
                            if len(cleaned) > 2:
                                tokens.add(cleaned)
                # 2. Key content words from Abstract/Title
                resolved_abs = self.resolve_section_key(doc, "Abstract")
                if resolved_abs and resolved_abs in doc:
                    words = re.findall(r"\b[a-zA-Z]{4,}\b", doc[resolved_abs].lower())
                    stopwords = {"this", "that", "with", "from", "were", "been", "have", "paper", "study", "using", "which"}
                    tokens.update([w for w in words if w not in stopwords])
                return tokens

            target_tokens = extract_tokens(target_doc)
            if not target_tokens:
                return []

            results = []
            for other_key, other_doc in self._documents.items():
                if other_key == target_key:
                    continue
                other_tokens = extract_tokens(other_doc)
                if not other_tokens:
                    continue
                intersection = target_tokens.intersection(other_tokens)
                if intersection:
                    score = len(intersection) / max(1, len(target_tokens.union(other_tokens)))
                    results.append((other_key, round(score * 100, 1), sorted(list(intersection))[:5]))

            results.sort(key=lambda x: x[1], reverse=True)
            return results

    def clear(self) -> None:
        """Clear all indexed documents."""
        with self._lock:
            self._documents.clear()
