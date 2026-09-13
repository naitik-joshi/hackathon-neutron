const stopwords = new Set([
  "a",
  "about",
  "after",
  "again",
  "all",
  "also",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "between",
  "both",
  "but",
  "by",
  "can",
  "could",
  "did",
  "do",
  "does",
  "during",
  "each",
  "for",
  "from",
  "had",
  "has",
  "have",
  "having",
  "how",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "may",
  "more",
  "most",
  "not",
  "of",
  "on",
  "or",
  "other",
  "our",
  "should",
  "such",
  "than",
  "that",
  "the",
  "their",
  "these",
  "this",
  "those",
  "through",
  "to",
  "using",
  "was",
  "we",
  "were",
  "which",
  "while",
  "with",
  "would",
]);

export const genericResearchTerms = new Set([
  "analysis",
  "approach",
  "data",
  "demo",
  "finding",
  "findings",
  "method",
  "methods",
  "paper",
  "research",
  "result",
  "results",
  "study",
  "system",
]);

const meaningfulShortTerms = new Set(["ai", "ml", "vr", "ar", "ui", "ux"]);

export function normalizeText(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("en")
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function tokenize(value: string, includeGeneric = true): string[] {
  if (!value.trim()) return [];
  return normalizeText(value)
    .split(" ")
    .filter(Boolean)
    .filter((token) => !stopwords.has(token))
    .filter(
      (token) =>
        Array.from(token).length >= 3 || meaningfulShortTerms.has(token),
    )
    .filter((token) => includeGeneric || !genericResearchTerms.has(token));
}

export function bigrams(tokens: string[]): string[] {
  const result: string[] = [];
  for (let index = 0; index < tokens.length - 1; index += 1) {
    if (tokens[index] !== tokens[index + 1]) {
      result.push(`${tokens[index]} ${tokens[index + 1]}`);
    }
  }
  return result;
}

export function termWeights(title: string, abstract: string) {
  const weights = new Map<string, number>();
  for (const token of tokenize(title)) {
    weights.set(token, (weights.get(token) ?? 0) + 3);
  }
  for (const token of tokenize(abstract)) {
    weights.set(token, (weights.get(token) ?? 0) + 1);
  }
  return weights;
}
