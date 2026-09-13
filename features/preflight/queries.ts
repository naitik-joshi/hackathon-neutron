import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Publication } from "@/lib/supabase/database.types";
import { toPublishedCandidates } from "./records";
import type {
  PreflightPublicationCandidate,
  PreflightResearchArea,
} from "./types";

const candidateLimit = 100;

export async function loadPreflightReferenceData(
  client: SupabaseClient<Database>,
): Promise<{
  candidates: PreflightPublicationCandidate[];
  areas: PreflightResearchArea[];
}> {
  const [publicationResult, areaResult] = await Promise.all([
    client
      .from("publications")
      .select("id,slug,title,abstract,year,is_demo,status")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(candidateLimit),
    client
      .from("research_areas")
      .select("id,name,slug,description,is_demo")
      .order("name")
      .limit(100),
  ]);

  if (publicationResult.error || areaResult.error) {
    throw new Error(
      "Submission readiness could not load public research data.",
    );
  }

  return {
    candidates: toPublishedCandidates(
      publicationResult.data as Pick<
        Publication,
        "id" | "slug" | "title" | "abstract" | "year" | "is_demo" | "status"
      >[],
    ),
    areas: areaResult.data.map((area) => ({
      id: area.id,
      name: area.name,
      slug: area.slug,
      description: area.description,
      isDemo: area.is_demo,
    })),
  };
}
