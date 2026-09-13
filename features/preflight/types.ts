export type OverlapLevel = "low" | "moderate" | "high";
export type SuggestionConfidence = "possible" | "moderate" | "strong";

export type PreflightPublicationCandidate = {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  year: number | null;
  isDemo: boolean;
};

export type PreflightResearchArea = {
  id: string;
  name: string;
  slug: string;
  description: string;
  isDemo: boolean;
};

export type RelatedWork = {
  id: string;
  slug: string;
  title: string;
  year: number | null;
  isDemo: boolean;
  overlapPercent: number;
  overlapLevel: OverlapLevel;
  sharedTerms: string[];
};

export type TopicSuggestion = {
  id: string;
  name: string;
  slug: string;
  isDemo: boolean;
  confidence: SuggestionConfidence;
  matchingTerms: string[];
};

export type CitationWarning = {
  code:
    | "duplicate"
    | "missing-year"
    | "malformed-doi"
    | "malformed-url"
    | "incomplete";
  message: string;
  lineNumbers: number[];
};

export type CitationReadiness = {
  status: "no-references" | "review-recommended" | "looks-complete";
  referenceCount: number;
  duplicateCount: number;
  withYearCount: number;
  doiCount: number;
  malformedDoiCount: number;
  urlCount: number;
  malformedUrlCount: number;
  warnings: CitationWarning[];
};

export type PublicationPreflightResult = {
  relatedWork: RelatedWork[];
  topicSuggestions: TopicSuggestion[];
  keywords: string[];
  citationReadiness: CitationReadiness;
  generatedAt: string;
};

export type SavedPublicationContext = Omit<
  PublicationPreflightResult,
  "citationReadiness" | "generatedAt"
>;

export type PreflightActionState = {
  data?: PublicationPreflightResult;
  error?: string;
};
