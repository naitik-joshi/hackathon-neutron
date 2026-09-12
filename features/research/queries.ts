import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  Area,
  Researcher,
  Publication,
} from "@/lib/supabase/database.types";
import type { ProjectWithRelations } from "@/features/projects/queries";

export async function listAreas() {
  const client = await createClient();
  const { data, error } = await client
    .from("research_areas")
    .select("*")
    .order("name")
    .limit(100);
  if (error) throw new Error("Could not load research areas");
  return data;
}
export async function listPublications(query = "", limit = 50) {
  const client = await createClient();
  let request = client
    .from("publications")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  // Bound user input and escape LIKE wildcards. No interpolated PostgREST filter grammar.
  const term = query
    .trim()
    .slice(0, 100)
    .replace(/[\\%_]/g, "\\$&");
  if (term) request = request.ilike("title", `%${term}%`);
  const { data, error } = await request;
  if (error) throw new Error("Could not load published research");
  return data;
}

export async function listResearchers(query = "") {
  const client = await createClient();
  let request = client.from("researchers").select("*").order("name");
  const term = query.trim().slice(0, 100).replace(/[\\%_]/g, "\\$&");
  if (term) request = request.ilike("name", `%${term}%`);
  const { data, error } = await request;
  if (error) throw new Error("Could not load researchers");
  return data;
}

export type ResearcherDetailData = {
  researcher: Researcher;
  areas: Area[];
  projects: ProjectWithRelations[];
  publications: Publication[];
};

export async function getResearcherWithRelations(
  slug: string,
): Promise<ResearcherDetailData | null> {
  const client = await createClient();

  const { data: researcher, error: resError } = await client
    .from("researchers")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (resError) throw new Error("Could not load researcher");
  if (!researcher) return null;

  const [areaLinksRes, projectLinksRes, pubLinksRes] = await Promise.all([
    client
      .from("researcher_research_areas")
      .select("research_area_id")
      .eq("researcher_id", researcher.id),
    client
      .from("researcher_projects")
      .select("project_id")
      .eq("researcher_id", researcher.id),
    client
      .from("publication_researchers")
      .select("publication_id")
      .eq("researcher_id", researcher.id),
  ]);

  if (areaLinksRes.error || projectLinksRes.error || pubLinksRes.error) {
    throw new Error("Could not load researcher relations");
  }

  const areaIds = areaLinksRes.data.map((r) => r.research_area_id);
  const projectIds = projectLinksRes.data.map((r) => r.project_id);
  const pubIds = pubLinksRes.data.map((r) => r.publication_id);

  let areas: Area[] = [];
  if (areaIds.length > 0) {
    const { data } = await client.from("research_areas").select("*").in("id", areaIds);
    areas = data || [];
  }

  let projects: ProjectWithRelations[] = [];
  if (projectIds.length > 0) {
    const { data: projectsData, error: pError } = await client
      .from("projects")
      .select("*")
      .in("id", projectIds);
    if (pError) throw new Error("Could not load projects");

    const [pAreaLinks, pResLinks, pPubLinks] = await Promise.all([
      client.from("project_research_areas").select("*").in("project_id", projectIds),
      client.from("researcher_projects").select("*").in("project_id", projectIds),
      client.from("publication_projects").select("*").in("project_id", projectIds),
    ]);

    const allAreaIds = Array.from(new Set(pAreaLinks.data?.map((r) => r.research_area_id) || []));
    const allResIds = Array.from(new Set(pResLinks.data?.map((r) => r.researcher_id) || []));
    const allPubIds = Array.from(new Set(pPubLinks.data?.map((r) => r.publication_id) || []));

    const [areasRes, researchersRes, pubsRes] = await Promise.all([
      allAreaIds.length ? client.from("research_areas").select("*").in("id", allAreaIds) : { data: [] },
      allResIds.length ? client.from("researchers").select("*").in("id", allResIds) : { data: [] },
      allPubIds.length ? client.from("publications").select("id").eq("status", "published").in("id", allPubIds) : { data: [] },
    ]);

    const areaMap = new Map((areasRes.data || []).map((a) => [a.id, a]));
    const resMap = new Map((researchersRes.data || []).map((r) => [r.id, r]));
    const pubSet = new Set((pubsRes.data || []).map((p) => p.id));

    projects = (projectsData || []).map((p) => {
      const pAreas = (pAreaLinks.data || [])
        .filter((l) => l.project_id === p.id)
        .map((l) => areaMap.get(l.research_area_id)!)
        .filter(Boolean);
      const pRes = (pResLinks.data || [])
        .filter((l) => l.project_id === p.id)
        .map((l) => resMap.get(l.researcher_id)!)
        .filter(Boolean);
      const pPubCount = (pPubLinks.data || [])
        .filter((l) => l.project_id === p.id && pubSet.has(l.publication_id))
        .length;
      return { ...p, areas: pAreas, researchers: pRes, publicationCount: pPubCount };
    });
  }

  let publications: Publication[] = [];
  if (pubIds.length > 0) {
    const { data: pubData, error: pubError } = await client
      .from("publications")
      .select("*")
      .eq("status", "published")
      .in("id", pubIds)
      .order("published_at", { ascending: false });
    if (pubError) throw new Error("Could not load publications");
    publications = pubData || [];
  }

  return {
    researcher,
    areas,
    projects,
    publications,
  };
}
