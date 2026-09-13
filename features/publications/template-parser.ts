import type { PublicationDocumentMetadata } from "./document-schema";

export type ExtractedPublication = PublicationDocumentMetadata & {
  title: string;
  abstract: string;
};

const headings = {
  abstract: /^abstract$/i,
  keywords: /^keywords\s*:/i,
  introduction: /^1\.\s*introduction\b/i,
  literatureReview: /^2\.\s*literature and related work\b/i,
  methodology: /^3\.\s*methodology\s*\/\s*approach\b/i,
  resultsAndDiscussion: /^4\.\s*results and discussion\b/i,
  conclusion: /^5\.\s*conclusion\b/i,
  disclosureStatement: /^disclosure statement$/i,
  ethicalApproval: /^ethical approval\s*:/i,
  consentToParticipate: /^consent to participate\s*:/i,
  consentToPublish: /^consent to publish\s*:/i,
  dataAvailability: /^data availability statement\s*:/i,
  aiTools: /^use of artificial intelligence \(ai\) tools\s*:/i,
  authorContributions: /^authors[’'] contributions\s*:/i,
  funding: /^funding\s*:/i,
  competingInterests: /^competing interests\s*:/i,
  acknowledgements: /^acknowledgements$/i,
  references: /^references$/i,
} as const;

type Heading = keyof typeof headings;

function clean(value: string) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isTemplateText(value: string) {
  const normalized = value.trim();
  return (
    !normalized ||
    /^\[[\s\S]*\]$/.test(normalized) ||
    /^A Descriptive Subtitle That Clarifies the Scope$/i.test(normalized) ||
    /^Author One¹?, Author Two²?, Author Three²?$/i.test(normalized) ||
    /^\.$/.test(normalized) ||
    normalized.includes("[Institution Name]") ||
    normalized.includes("[Department]") ||
    /^keyword one; keyword two;/i.test(normalized) ||
    /^Harvard Author[–-]Date Format\./i.test(normalized)
  );
}

function valueAfterLabel(line: string, label: RegExp) {
  const value = clean(line.replace(label, ""));
  return isTemplateText(value) ? "" : value;
}

function contentBetween(
  lines: string[],
  indexes: Map<Heading, number>,
  start: Heading,
  end: Heading | null,
) {
  const startIndex = indexes.get(start);
  if (startIndex === undefined) return "";
  const endIndex = end ? indexes.get(end) : undefined;
  const content = clean(
    lines.slice(startIndex + 1, endIndex ?? lines.length).join("\n"),
  );
  return isTemplateText(content) ? "" : content;
}

function inlineOrFollowing(
  lines: string[],
  indexes: Map<Heading, number>,
  start: Heading,
  end: Heading | null,
) {
  const index = indexes.get(start);
  if (index === undefined) return "";
  const inline = valueAfterLabel(lines[index], headings[start]);
  return inline || contentBetween(lines, indexes, start, end);
}

export function parseArticleTemplate(rawText: string): ExtractedPublication {
  const lines = rawText
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => clean(line))
    .filter(Boolean);

  const indexes = new Map<Heading, number>();
  for (const [heading, pattern] of Object.entries(headings) as [
    Heading,
    RegExp,
  ][]) {
    const index = lines.findIndex((line) => pattern.test(line));
    if (index >= 0) indexes.set(heading, index);
  }

  const titleLine = lines.find((line) => /^full article title\s*:/i.test(line));
  const title = titleLine
    ? valueAfterLabel(titleLine, /^full article title\s*:/i)
    : "";
  const abstractIndex = indexes.get("abstract") ?? lines.length;
  const submittedIndex = lines.findIndex((line) =>
    /^submitted on\s*:/i.test(line),
  );
  const correspondenceIndex = lines.findIndex((line) =>
    /^correspondence\s*:/i.test(line),
  );
  const titleIndex = titleLine ? lines.indexOf(titleLine) : -1;
  const peopleEnd = [submittedIndex, correspondenceIndex, abstractIndex]
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  const people = lines.slice(titleIndex + 1, peopleEnd);
  const authors = isTemplateText(people[0] || "") ? "" : people[0] || "";
  const affiliations = clean(people.slice(1).join("\n"));
  const keywordsLine = lines.find((line) => /^keywords\s*:/i.test(line));

  return {
    title,
    authors,
    affiliations: isTemplateText(affiliations) ? "" : affiliations,
    submittedOn:
      submittedIndex >= 0
        ? valueAfterLabel(lines[submittedIndex], /^submitted on\s*:/i)
        : "",
    correspondence:
      correspondenceIndex >= 0
        ? valueAfterLabel(lines[correspondenceIndex], /^correspondence\s*:/i)
        : "",
    abstract: contentBetween(lines, indexes, "abstract", "keywords"),
    keywords: keywordsLine
      ? valueAfterLabel(keywordsLine, /^keywords\s*:/i)
      : "",
    introduction: contentBetween(
      lines,
      indexes,
      "introduction",
      "literatureReview",
    ),
    literatureReview: contentBetween(
      lines,
      indexes,
      "literatureReview",
      "methodology",
    ),
    methodology: contentBetween(
      lines,
      indexes,
      "methodology",
      "resultsAndDiscussion",
    ),
    resultsAndDiscussion: contentBetween(
      lines,
      indexes,
      "resultsAndDiscussion",
      "conclusion",
    ),
    conclusion: contentBetween(
      lines,
      indexes,
      "conclusion",
      "disclosureStatement",
    ),
    disclosureStatement: contentBetween(
      lines,
      indexes,
      "disclosureStatement",
      "ethicalApproval",
    ),
    ethicalApproval: inlineOrFollowing(
      lines,
      indexes,
      "ethicalApproval",
      "consentToParticipate",
    ),
    consentToParticipate: inlineOrFollowing(
      lines,
      indexes,
      "consentToParticipate",
      "consentToPublish",
    ),
    consentToPublish: inlineOrFollowing(
      lines,
      indexes,
      "consentToPublish",
      "dataAvailability",
    ),
    dataAvailability: inlineOrFollowing(
      lines,
      indexes,
      "dataAvailability",
      "aiTools",
    ),
    aiTools: inlineOrFollowing(
      lines,
      indexes,
      "aiTools",
      "authorContributions",
    ),
    authorContributions: inlineOrFollowing(
      lines,
      indexes,
      "authorContributions",
      "funding",
    ),
    funding: inlineOrFollowing(lines, indexes, "funding", "competingInterests"),
    competingInterests: inlineOrFollowing(
      lines,
      indexes,
      "competingInterests",
      "acknowledgements",
    ),
    acknowledgements: contentBetween(
      lines,
      indexes,
      "acknowledgements",
      "references",
    ),
    references: contentBetween(lines, indexes, "references", null),
  };
}
