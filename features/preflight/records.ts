import type { Publication } from "../../lib/supabase/database.types.ts";
import type { PreflightPublicationCandidate } from "./types.ts";

export function toPublishedCandidates(
  publications: Pick<
    Publication,
    "id" | "slug" | "title" | "abstract" | "year" | "is_demo" | "status"
  >[],
): PreflightPublicationCandidate[] {
  return publications
    .filter((publication) => publication.status === "published")
    .map((publication) => ({
      id: publication.id,
      slug: publication.slug,
      title: publication.title,
      abstract: publication.abstract,
      year: publication.year,
      isDemo: publication.is_demo,
    }));
}
