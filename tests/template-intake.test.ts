import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseArticleTemplate } from "../features/publications/template-parser.ts";
import {
  publicationDocumentMetadataSchema,
  sanitizeDocumentName,
  validateResearchDocumentFile,
} from "../features/publications/document-schema.ts";
import {
  extractPdfText,
  PdfTextError,
  pdfTextErrorMessage,
} from "../features/publications/pdf-text.ts";

const article = `
Full Article Title: Grounded Research Discovery in Practice

Rabin Bam, Example Author
Department of Computing, Islington College, Kathmandu, Nepal
Submitted on: September 13, 2026
Correspondence: rabin@example.edu

Abstract
This study evaluates a grounded research discovery workflow with enough detail for review.
Keywords: grounding; research discovery; evaluation

1. Introduction
The introduction explains the institutional research problem.

2. Literature and Related Work
Prior work establishes the gap addressed by the study.

3. Methodology / Approach
The team evaluated the system against a fixed set of documents.

4. Results and Discussion
The grounded workflow returned supported answers.

5. Conclusion
The approach improved access to research evidence.

Disclosure Statement
The authors report no conflict.
Ethical Approval: Not applicable.
Consent to Participate: Not applicable.
Consent to Publish: All authors consented.
Data Availability Statement: Available on request.
Use of Artificial Intelligence (AI) Tools: Used for language review only.
Authors’ Contributions: All authors contributed.
Funding: No external funding.
Competing Interests: None.

Acknowledgements
The authors thank the review team.

References
Bam, R. (2026). Grounded research discovery.
`;

test("article template extraction maps canonical fields", () => {
  const parsed = parseArticleTemplate(article);
  assert.equal(parsed.title, "Grounded Research Discovery in Practice");
  assert.equal(parsed.authors, "Rabin Bam, Example Author");
  assert.match(parsed.affiliations || "", /Islington College/);
  assert.equal(parsed.submittedOn, "September 13, 2026");
  assert.equal(parsed.correspondence, "rabin@example.edu");
  assert.match(parsed.abstract, /grounded research discovery/);
  assert.equal(parsed.keywords, "grounding; research discovery; evaluation");
  assert.match(parsed.methodology || "", /fixed set of documents/);
  assert.equal(parsed.ethicalApproval, "Not applicable.");
  assert.equal(parsed.funding, "No external funding.");
  assert.match(parsed.references || "", /Bam, R/);
});

test("unchanged article-template prompts are not treated as publication data", () => {
  const parsed = parseArticleTemplate(`
Full Article Title: A Descriptive Subtitle That Clarifies the Scope
Author One¹, Author Two², Author Three²
Submitted on: [Month DD, YYYY]
Correspondence: [corresponding.author@institution.edu]
Abstract
[Provide a concise summary of the article in 150–250 words.]
Keywords: keyword one; keyword two; keyword three
1. Introduction
[Introduce the topic.]
2. Literature and Related Work
[Summarize existing literature.]
3. Methodology / Approach
[Describe the research design.]
4. Results and Discussion
[Present the main findings.]
5. Conclusion
[Summarise the key contributions.]
Disclosure Statement
[State any conflicts.]
Ethical Approval: [Where applicable]
Consent to Participate: [If applicable]
Consent to Publish: [If applicable]
Data Availability Statement:
Use of Artificial Intelligence (AI) Tools:
Authors’ Contributions:
Funding:
Competing Interests:
Acknowledgements
[Optional.]
References
Harvard Author–Date Format. List all cited works.
`);
  assert.equal(parsed.title, "");
  assert.equal(parsed.authors, "");
  assert.equal(parsed.abstract, "");
  assert.equal(parsed.keywords, "");
  assert.equal(parsed.introduction, "");
  assert.equal(parsed.references, "");
});

test("document metadata and file constraints reject unsafe input", () => {
  assert.equal(
    publicationDocumentMetadataSchema.safeParse({
      authors: "Example Author",
      funding: "None",
    }).success,
    true,
  );
  assert.equal(
    publicationDocumentMetadataSchema.safeParse({
      authors: "x".repeat(2001),
    }).success,
    false,
  );
  assert.equal(
    validateResearchDocumentFile(
      new File(["document"], "paper.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
    ),
    null,
  );
  assert.equal(
    validateResearchDocumentFile(
      new File(["%PDF"], "paper.pdf", { type: "application/pdf" }),
    ),
    null,
  );
  assert.match(
    validateResearchDocumentFile(
      new File(["text"], "paper.txt", { type: "text/plain" }),
    ) || "",
    /\.docx or \.pdf/,
  );
  assert.equal(
    sanitizeDocumentName("../private/<draft>\u0000.pdf"),
    "-draft-.pdf",
  );
});

test("PDF extraction reads text from an existing research paper", async () => {
  const source = await readFile(
    new URL(
      "../qwen-grounded-paper-system/watch_papers/IJMR_Aditi.pdf",
      import.meta.url,
    ),
  );
  const text = await extractPdfText(source);
  const parsed = parseArticleTemplate(text);
  assert.match(text, /Abstract/i);
  assert.ok(text.length > 1000);
  assert.equal(
    parsed.title,
    "Machine Learning Based Postpartum Depression Risk Prediction: A Case Study on a Bangladeshi Dataset with Transferability Discussions for Nepal",
  );
  assert.match(parsed.abstract, /Postpartum depression/);
  assert.match(parsed.introduction || "", /machine learning/i);
});

test("malformed PDF content is rejected during server extraction", async () => {
  await assert.rejects(extractPdfText(Buffer.from("not a PDF")));
});

test("scanned PDF failures use the honest no-text message", () => {
  assert.equal(
    pdfTextErrorMessage(new PdfTextError("NO_TEXT")),
    "This PDF does not contain enough extractable text.",
  );
});
