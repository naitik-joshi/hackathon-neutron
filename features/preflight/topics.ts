import { bigrams, normalizeText, tokenize } from "./text.ts";
import type {
  PreflightResearchArea,
  SuggestionConfidence,
  TopicSuggestion,
} from "./types.ts";

function confidence(score: number): SuggestionConfidence {
  if (score >= 48) return "strong";
  if (score >= 24) return "moderate";
  return "possible";
}

export function suggestResearchAreas(
  title: string,
  abstract: string,
  areas: PreflightResearchArea[],
  limit = 3,
): TopicSuggestion[] {
  const draftText = normalizeText(`${title} ${abstract}`);
  const titleText = normalizeText(title);
  const draftTokens = new Set(tokenize(draftText, false));

  return areas
    .map((area) => {
      const areaName = normalizeText(area.name);
      const nameTokens = tokenize(area.name, false);
      const descriptionTokens = tokenize(area.description, false);
      const matchingTerms = [...new Set([...nameTokens, ...descriptionTokens])]
        .filter((token) => draftTokens.has(token))
        .sort((a, b) => a.localeCompare(b));
      const exactName =
        areaName.length > 2 &&
        (titleText.includes(areaName) || draftText.includes(areaName));
      const titleMatches = nameTokens.filter((token) =>
        tokenize(titleText, false).includes(token),
      ).length;
      const denominator = Math.max(
        1,
        new Set([...nameTokens, ...descriptionTokens]).size,
      );
      const score = Math.min(
        100,
        (matchingTerms.length / denominator) * 100 +
          titleMatches * 12 +
          (exactName ? 35 : 0),
      );
      return {
        area,
        score,
        suggestion: {
          id: area.id,
          name: area.name,
          slug: area.slug,
          isDemo: area.isDemo,
          confidence: confidence(score),
          matchingTerms: matchingTerms.slice(0, 5),
        } satisfies TopicSuggestion,
      };
    })
    .filter(
      ({ score, suggestion }) =>
        score >= 10 && suggestion.matchingTerms.length > 0,
    )
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.area.name.localeCompare(right.area.name) ||
        left.area.id.localeCompare(right.area.id),
    )
    .slice(0, limit)
    .map(({ suggestion }) => suggestion);
}

export function extractKeywords(
  title: string,
  abstract: string,
  limit = 8,
): string[] {
  const titleTokens = tokenize(title, false);
  const abstractTokens = tokenize(abstract, false);
  const scores = new Map<string, number>();

  for (const token of titleTokens) {
    scores.set(token, (scores.get(token) ?? 0) + 5);
  }
  for (const token of abstractTokens) {
    scores.set(token, (scores.get(token) ?? 0) + 1);
  }
  for (const phrase of bigrams(titleTokens)) {
    scores.set(phrase, (scores.get(phrase) ?? 0) + 7);
  }
  for (const phrase of bigrams(abstractTokens)) {
    scores.set(phrase, (scores.get(phrase) ?? 0) + 2);
  }

  return [...scores]
    .filter(([term]) => !/^\d+$/.test(term))
    .sort(
      ([leftTerm, leftScore], [rightTerm, rightScore]) =>
        rightScore - leftScore || leftTerm.localeCompare(rightTerm),
    )
    .map(([term]) => term)
    .filter(
      (term, index, terms) =>
        !terms.some(
          (other, otherIndex) =>
            otherIndex < index && other.includes(" ") && other.includes(term),
        ),
    )
    .slice(0, limit);
}
