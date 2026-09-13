import { bigrams, termWeights, tokenize } from "./text.ts";
import type {
  OverlapLevel,
  PreflightPublicationCandidate,
  RelatedWork,
} from "./types.ts";

function cosine(left: Map<string, number>, right: Map<string, number>) {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (const value of left.values()) leftMagnitude += value * value;
  for (const [term, value] of right) {
    rightMagnitude += value * value;
    dot += value * (left.get(term) ?? 0);
  }

  if (!leftMagnitude || !rightMagnitude) return 0;
  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

function overlapLevel(percent: number): OverlapLevel {
  if (percent >= 45) return "high";
  if (percent >= 20) return "moderate";
  return "low";
}

function sharedTerms(
  title: string,
  abstract: string,
  candidate: PreflightPublicationCandidate,
) {
  const draftTokens = tokenize(`${title} ${abstract}`, false);
  const candidateTokens = tokenize(
    `${candidate.title} ${candidate.abstract}`,
    false,
  );
  const candidateSet = new Set(candidateTokens);
  const sharedBigrams = bigrams(draftTokens).filter((phrase) =>
    new Set(bigrams(candidateTokens)).has(phrase),
  );
  const sharedSingles = [...new Set(draftTokens)]
    .filter((term) => candidateSet.has(term))
    .sort((a, b) => a.localeCompare(b));

  return [...new Set([...sharedBigrams, ...sharedSingles])].slice(0, 6);
}

export function findRelatedWork(
  title: string,
  abstract: string,
  candidates: PreflightPublicationCandidate[],
  currentPublicationId?: string,
  limit = 5,
): RelatedWork[] {
  const draftWeights = termWeights(title, abstract);

  return candidates
    .filter((candidate) => candidate.id !== currentPublicationId)
    .map((candidate) => {
      const overlapPercent = Math.round(
        cosine(draftWeights, termWeights(candidate.title, candidate.abstract)) *
          100,
      );
      return {
        id: candidate.id,
        slug: candidate.slug,
        title: candidate.title,
        year: candidate.year,
        isDemo: candidate.isDemo,
        overlapPercent,
        overlapLevel: overlapLevel(overlapPercent),
        sharedTerms: sharedTerms(title, abstract, candidate),
      } satisfies RelatedWork;
    })
    .filter(
      (result) => result.overlapPercent >= 5 && result.sharedTerms.length >= 1,
    )
    .sort(
      (left, right) =>
        right.overlapPercent - left.overlapPercent ||
        left.title.localeCompare(right.title) ||
        left.id.localeCompare(right.id),
    )
    .slice(0, limit);
}
