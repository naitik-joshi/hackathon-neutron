import { normalizeText } from "./text.ts";
import type { CitationReadiness, CitationWarning } from "./types.ts";

const yearPattern = /\b(?:19|20)\d{2}\b/;
const validDoiPattern = /^10\.\d{4,9}\/\S+$/i;
const doiLookingPattern = /\b10\.\S+/gi;
const urlLookingPattern = /https?:\/\/[^\s]*/gi;

function cleanToken(value: string) {
  return value.replace(/[),.;\]}]+$/g, "");
}

function normalizedReference(value: string) {
  return normalizeText(value.replace(/https?:\/\/(?:dx\.)?doi\.org\//gi, ""));
}

function isCompleteReference(line: string, dois: string[], urls: string[]) {
  const normalized = normalizeText(line);
  const onlyIdentifier =
    (dois.length === 1 && normalizedReference(dois[0]) === normalized) ||
    (urls.length === 1 && normalizeText(urls[0]) === normalized);
  return normalized.length >= 20 && !onlyIdentifier;
}

export function checkCitationReadiness(
  referencesText: string,
): CitationReadiness {
  const lines = referencesText
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/\s+/g, " "))
    .filter(Boolean);
  const warnings: CitationWarning[] = [];
  if (!lines.length) {
    return {
      status: "no-references",
      referenceCount: 0,
      duplicateCount: 0,
      withYearCount: 0,
      doiCount: 0,
      malformedDoiCount: 0,
      urlCount: 0,
      malformedUrlCount: 0,
      warnings: [],
    };
  }

  const seen = new Map<string, number>();
  const duplicateLines: number[] = [];
  const missingYearLines: number[] = [];
  const malformedDoiLines: number[] = [];
  const malformedUrlLines: number[] = [];
  const incompleteLines: number[] = [];
  let doiCount = 0;
  let malformedDoiCount = 0;
  let urlCount = 0;
  let malformedUrlCount = 0;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const duplicateKey = normalizedReference(line);
    if (seen.has(duplicateKey)) duplicateLines.push(lineNumber);
    else seen.set(duplicateKey, lineNumber);
    if (!yearPattern.test(line)) missingYearLines.push(lineNumber);

    const dois = (line.match(doiLookingPattern) ?? []).map(cleanToken);
    for (const doi of dois) {
      doiCount += 1;
      if (!validDoiPattern.test(doi)) {
        malformedDoiCount += 1;
        malformedDoiLines.push(lineNumber);
      }
    }

    const urls = (line.match(urlLookingPattern) ?? []).map(cleanToken);
    for (const url of urls) {
      urlCount += 1;
      try {
        const parsed = new URL(url);
        if (
          !parsed.hostname ||
          !["http:", "https:"].includes(parsed.protocol)
        ) {
          throw new Error("Unsupported URL");
        }
      } catch {
        malformedUrlCount += 1;
        malformedUrlLines.push(lineNumber);
      }
    }

    if (!isCompleteReference(line, dois, urls))
      incompleteLines.push(lineNumber);
  });

  const addWarning = (
    code: CitationWarning["code"],
    message: string,
    lineNumbers: number[],
  ) => {
    if (lineNumbers.length) {
      warnings.push({ code, message, lineNumbers: [...new Set(lineNumbers)] });
    }
  };
  addWarning(
    "duplicate",
    "Some reference lines appear more than once.",
    duplicateLines,
  );
  addWarning(
    "missing-year",
    "Some references do not include a clear 19xx or 20xx year.",
    missingYearLines,
  );
  addWarning(
    "malformed-doi",
    "Check the format of DOI-looking values on these lines.",
    malformedDoiLines,
  );
  addWarning(
    "malformed-url",
    "Check the format of URL-looking values on these lines.",
    malformedUrlLines,
  );
  addWarning(
    "incomplete",
    "These references may need author, title, source, or year details.",
    incompleteLines,
  );

  return {
    status: warnings.length ? "review-recommended" : "looks-complete",
    referenceCount: lines.length,
    duplicateCount: duplicateLines.length,
    withYearCount: lines.length - missingYearLines.length,
    doiCount,
    malformedDoiCount,
    urlCount,
    malformedUrlCount,
    warnings,
  };
}
