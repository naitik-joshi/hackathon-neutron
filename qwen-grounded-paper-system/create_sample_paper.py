"""
Generates a compliant sample research paper in ./watch_papers/sample_paper.docx
strictly adhering to the Target Research Paper Template Schema in AGENTS.md.
"""

from pathlib import Path
import docx
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

from config import WATCH_DIR


def create_sample_paper(output_path: Path = WATCH_DIR / "sample_paper.docx") -> Path:
    """Create a formatted .docx paper conforming to the schema."""
    doc = docx.Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    def add_title(text: str) -> None:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(text)
        run.bold = True
        run.font.size = Pt(18)
        run.font.name = "Arial"

    def add_subtitle(text: str) -> None:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(text)
        run.italic = True
        run.font.size = Pt(13)
        run.font.name = "Arial"

    def add_meta(text: str, italic: bool = False) -> None:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(text)
        run.italic = italic
        run.font.size = Pt(10)
        run.font.name = "Arial"

    def add_heading(text: str, level: int = 1) -> None:
        p = doc.add_paragraph()
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Arial"
        if level == 1:
            run.font.size = Pt(14)
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(4)
        elif level == 2:
            run.font.size = Pt(12)
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(3)

    def add_body(text: str) -> None:
        p = doc.add_paragraph()
        run = p.add_run(text)
        run.font.size = Pt(11)
        run.font.name = "Times New Roman"
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.15

    # 1. Header block
    add_title("Comparative Analysis of Closed-Domain Neural Reasoning Architectures in Academic Ingestion")
    add_subtitle("A Systematic Evaluation of Strict Boundary Grounding and Section-Isolated Prompting")
    add_meta("Aarav Sharma¹, Priya Patel², Dr. Elena Rostova¹*")
    add_meta("¹ Institute of Advanced Technology, Kathmandu, Nepal")
    add_meta("² Department of Artificial Intelligence, Oxford University, Oxford, United Kingdom")
    add_meta("Submitted on: September 12, 2026")
    add_meta("Correspondence: e.rostova@instadvtech.edu", italic=True)

    # 2. Abstract (150-250 words)
    add_heading("Abstract")
    add_body(
        "Modern retrieval-augmented generation architectures frequently exhibit hallucinations and unwarranted extrapolation "
        "when operating on specialized scientific corpora. In this investigation, we present a deterministic section-isolated ingestion "
        "framework designed to enforce strict closed-domain grounding over peer-reviewed academic literature. By partitioning incoming documents "
        "into canonical template hierarchies and coupling local transformer inference with zero-temperature execution, our approach enforces an "
        "uncompromising negative constraint. We evaluated the architecture against a suite of 250 domain-specific queries across 50 technical papers. "
        "Empirical benchmarks demonstrate an overall factual retrieval precision of 98.4%, with an inference latency of 42.1 milliseconds per isolated query. "
        "Crucially, the system attained an absolute 0.0% false-positive extrapolation rate on absent claims, strictly emitting the designated unavailable indicator. "
        "These results establish that combining deterministic document parsing with hard-constrained local inference reliably eliminates hallucinations in academic audit pipelines."
    )

    # 3. Keywords
    add_heading("Keywords")
    add_body("Keywords: closed-domain grounding; neural reasoning; deterministic parsing; document ingestion; zero-temperature inference")

    # 4. 1. Introduction
    add_heading("1. Introduction")
    add_body(
        "Automated extraction and factual auditing of academic literature require absolute fidelity to the source text (Lewis et al., 2020). "
        "Traditional generative language models often introduce synthetic claims or merge external pre-training knowledge with document facts, "
        "rendering them unreliable for rigorous compliance and peer review workflows. "
        "To mitigate this vulnerability, recent research has prioritized closed-domain verification where inference is strictly bounded by document boundaries (Vaswani et al., 2017). "
        "The primary objective of this paper is to evaluate whether deterministic section isolation combined with zero-temperature local inference "
        "can guarantee zero hallucination in research paper auditing. The remainder of this paper is organized as follows: Section 2 examines related literature; "
        "Section 3 details our methodology; Section 4 analyzes empirical findings; and Section 5 concludes the study."
    )

    # 5. 2. Literature and Related Work
    add_heading("2. Literature and Related Work")
    add_body(
        "Retrieval-Augmented Generation (RAG) frameworks have emerged as standard paradigms for document-based question answering (Lewis et al., 2020). "
        "However, typical dense retrieval systems inject chunking boundary noise and may include out-of-context text fragments."
    )
    add_heading("2.1 Retrieval Grounding and Hallucination Control", level=2)
    add_body(
        "Controlling hallucinations in large language models requires structural constraints at both retrieval and generation stages (Smith, 2023). "
        "Previous studies by Jones and Lee (2022) highlighted that open-ended decoding prompts allow models to extrapolate speculative hypotheses when answers are absent."
    )
    add_heading("2.2 Deterministic Sectional Ingestion", level=2)
    add_body(
        "Deterministic parsing ensures that document hierarchical structure is preserved without semantic distortion. By aligning document headings "
        "with an established template schema, questions targeting a specific analytical phase can be strictly isolated to the relevant section."
    )

    # 6. 3. Methodology / Approach
    add_heading("3. Methodology / Approach")
    add_body(
        "Our ingestion pipeline consists of three core components: a deterministic document parser, a thread-safe in-memory store, "
        "and a zero-temperature local Ollama bridge hosting the Qwen 2.5:3B model. The parser utilizes python-docx to traverse document elements "
        "and applies regular expressions against canonical schema headings. Upon detecting a new document, the system generates structured JSON "
        "and Markdown summaries within ./parsed_insights. For question answering, queries follow the strict syntax '<paper> | <section> | <query>'. "
        "The bridge extracts only the requested section text and transmits it alongside an invariant negative constraint."
    )

    # 7. 4. Results and Discussion
    add_heading("4. Results and Discussion")
    add_body(
        "Experimental evaluations were conducted across 250 evaluation probes. Table 1 summarizes the performance metrics observed across three benchmark categories: "
        "Factual Extraction, Boundary Invariance, and Absent Claim Rejection."
    )
    add_body("Table 1. Quantitative Performance Evaluation of the Ingestion Pipeline")
    
    # Add a formatted table
    table = doc.add_table(rows=4, cols=4)
    table.style = "Table Grid"
    headers = ["Metric", "Baseline RAG", "Unconstrained Qwen", "Our Grounded System"]
    for i, h in enumerate(headers):
        cell = table.cell(0, i)
        cell.text = h
        cell.paragraphs[0].runs[0].bold = True

    data = [
        ["Factual Accuracy", "81.2%", "87.5%", "96.8%"],
        ["F1-Score", "84.0%", "89.1%", "98.4%"],
        ["Hallucination Rate", "14.3%", "9.8%", "0.00%"],
    ]
    for row_idx, row_data in enumerate(data, start=1):
        for col_idx, text in enumerate(row_data):
            table.cell(row_idx, col_idx).text = text

    add_heading("4.1 Latency and Efficiency Analysis", level=2)
    add_body(
        "The mean end-to-end latency for single-section retrieval and local inference was measured at 42.1 milliseconds on standard consumer hardware. "
        "Memory overhead for caching 100 indexed research articles remained below 34 megabytes, demonstrating high runtime efficiency."
    )

    # 8. 5. Conclusion
    add_heading("5. Conclusion")
    add_body(
        "This work demonstrates that strict closed-domain grounding in academic document analysis can be reliably achieved through deterministic section isolation "
        "and local zero-temperature model execution. By constraining context to individual sections and requiring an exact unavailable indicator for absent claims, "
        "we eliminate false-positive extrapolations while maintaining high retrieval precision. Future work will extend this framework to multi-modal diagram analysis."
    )

    # Declarations & Statements
    add_heading("Disclosure Statement")
    add_body("The authors have no financial or non-financial disclosures to share for this article.")

    add_heading("Ethical Approval")
    add_body("Ethical Approval: Not applicable. This study does not involve human participants, medical data, or animal experimentation.")

    add_heading("Consent to Participate")
    add_body("Consent to Participate: Not applicable.")

    add_heading("Consent to Publish")
    add_body("Consent to Publish: All authors have reviewed the manuscript and provided consent for publication.")

    add_heading("Data Availability Statement")
    add_body("Data Availability Statement: All benchmarking code, evaluation scripts, and sample documents are publicly accessible via the project repository.")

    add_heading("Use of Artificial Intelligence (AI) Tools")
    add_body("Use of Artificial Intelligence (AI) Tools: The authors utilized generative AI tools exclusively for grammatical proofreading. No scientific findings or conceptual formulations were generated by AI.")

    add_heading("Authors’ Contributions")
    add_body("Authors’ Contributions: A. Sharma formulated the architecture and wrote the manuscript. P. Patel implemented the parser and automated test harness. E. Rostova directed the investigation and verified the experimental methodology.")

    add_heading("Funding")
    add_body("Funding: This research was funded by the National Science and Technology Innovation Grant (Grant No. NSTI-2026-0914).")

    add_heading("Competing Interests")
    add_body("Competing Interests: The authors declare that they have no competing interests.")

    add_heading("Acknowledgements")
    add_body("Acknowledgements: The authors acknowledge the Computing Resource Center for providing infrastructure and technical support.")

    # References
    add_heading("References")
    add_body(
        "Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., ... & Kiela, D. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. Advances in Neural Information Processing Systems, 33, pp. 9459-9474.\n\n"
        "Smith, J. (2023). Controlling hallucinations in local language model architectures. Journal of Computational Linguistics, 15(2), pp. 112-128. https://doi.org/10.1016/j.cl.2023.04.001\n\n"
        "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., ... & Polosukhin, I. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30, pp. 5998-6008."
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(output_path))
    print(f"[SamplePaper] Generated sample paper at: {output_path.resolve()}")
    return output_path


if __name__ == "__main__":
    create_sample_paper()
