import { checkCitationReadiness } from "./citations";
import { findRelatedWork } from "./similarity";
import { extractKeywords, suggestResearchAreas } from "./topics";
import type {
  PreflightPublicationCandidate,
  PreflightResearchArea,
  PublicationPreflightResult,
  SavedPublicationContext,
} from "./types";

export function analyzePublicationPreflight(input: {
  title: string;
  abstract: string;
  referencesText: string;
  candidates: PreflightPublicationCandidate[];
  areas: PreflightResearchArea[];
  currentPublicationId?: string;
}): PublicationPreflightResult {
  return {
    relatedWork: findRelatedWork(
      input.title,
      input.abstract,
      input.candidates,
      input.currentPublicationId,
    ),
    topicSuggestions: suggestResearchAreas(
      input.title,
      input.abstract,
      input.areas,
    ),
    keywords: extractKeywords(input.title, input.abstract),
    citationReadiness: checkCitationReadiness(input.referencesText),
    generatedAt: new Date().toISOString(),
  };
}

export function analyzeSavedPublicationContext(input: {
  title: string;
  abstract: string;
  candidates: PreflightPublicationCandidate[];
  areas: PreflightResearchArea[];
  currentPublicationId: string;
}): SavedPublicationContext {
  return {
    relatedWork: findRelatedWork(
      input.title,
      input.abstract,
      input.candidates,
      input.currentPublicationId,
    ),
    topicSuggestions: suggestResearchAreas(
      input.title,
      input.abstract,
      input.areas,
    ),
    keywords: extractKeywords(input.title, input.abstract),
  };
}
