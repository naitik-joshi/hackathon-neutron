import { z } from "zod";

export const RESEARCH_DOCUMENT_BUCKET = "ResearchFileData";
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
export const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export const PDF_MIME = "application/pdf";

export type ResearchDocumentKind = "docx" | "pdf";

export function getResearchDocumentDetails(file: File): {
  kind: ResearchDocumentKind;
  extension: ResearchDocumentKind;
  contentType: string;
} | null {
  const name = file.name.toLowerCase();
  if (name.endsWith(".docx")) {
    return { kind: "docx", extension: "docx", contentType: DOCX_MIME };
  }
  if (name.endsWith(".pdf")) {
    return { kind: "pdf", extension: "pdf", contentType: PDF_MIME };
  }
  return null;
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || undefined)
    .optional();

export const publicationDocumentMetadataSchema = z.object({
  authors: optionalText(2000),
  affiliations: optionalText(4000),
  submittedOn: optionalText(100),
  correspondence: optionalText(500),
  keywords: optionalText(1000),
  introduction: optionalText(30000),
  literatureReview: optionalText(30000),
  methodology: optionalText(30000),
  resultsAndDiscussion: optionalText(50000),
  conclusion: optionalText(30000),
  disclosureStatement: optionalText(5000),
  ethicalApproval: optionalText(3000),
  consentToParticipate: optionalText(3000),
  consentToPublish: optionalText(3000),
  dataAvailability: optionalText(5000),
  aiTools: optionalText(5000),
  authorContributions: optionalText(5000),
  funding: optionalText(3000),
  competingInterests: optionalText(3000),
  acknowledgements: optionalText(5000),
  references: optionalText(50000),
});

export type PublicationDocumentMetadata = z.infer<
  typeof publicationDocumentMetadataSchema
>;

export const publicationDocumentFields = [
  "authors",
  "affiliations",
  "submittedOn",
  "correspondence",
  "keywords",
  "introduction",
  "literatureReview",
  "methodology",
  "resultsAndDiscussion",
  "conclusion",
  "disclosureStatement",
  "ethicalApproval",
  "consentToParticipate",
  "consentToPublish",
  "dataAvailability",
  "aiTools",
  "authorContributions",
  "funding",
  "competingInterests",
  "acknowledgements",
  "references",
] as const satisfies readonly (keyof PublicationDocumentMetadata)[];

export function metadataFromForm(form: FormData) {
  return publicationDocumentMetadataSchema.safeParse(
    Object.fromEntries(
      publicationDocumentFields.map((field) => {
        const value = form.get(field);
        return [field, typeof value === "string" ? value : ""];
      }),
    ),
  );
}

export function validateResearchDocumentFile(file: File) {
  const details = getResearchDocumentDetails(file);
  if (!details)
    return "Upload a .docx or .pdf file based on the article template.";
  if (file.size === 0) return "The uploaded document is empty.";
  if (file.size > MAX_DOCUMENT_BYTES) {
    return "The document must be 10 MB or smaller.";
  }
  if (
    file.type &&
    file.type !== details.contentType &&
    file.type !== "application/octet-stream"
  ) {
    return details.kind === "pdf"
      ? "The selected .pdf file does not have a valid PDF content type."
      : "The selected .docx file does not have a valid Word content type.";
  }
  return null;
}
