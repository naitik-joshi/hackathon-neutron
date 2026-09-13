import type { QwenPaper } from "./types.ts";

export function normalizePaperTitle(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^demo data\s+/, "");
}

export function matchPaperByTitle(
  papers: QwenPaper[],
  publicationTitle: string,
) {
  const normalized = normalizePaperTitle(publicationTitle);
  if (!normalized) return undefined;
  return papers.find(
    (paper) => normalizePaperTitle(paper.title) === normalized,
  );
}
