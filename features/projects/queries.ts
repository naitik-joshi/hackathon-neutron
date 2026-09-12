import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  Project,
  Area,
  Researcher,
  Publication,
} from "@/lib/supabase/database.types";

export type ProjectWithRelations = Project & {
  areas: Area[];
  researchers: Researcher[];
  publicationCount: number;
};

export type ProjectDetailData = {
  project: Project;
  areas: Area[];
  researchers: Researcher[];
  publications: Publication[];
};

export async function listProjects(options?: {
  query?: string;
  status?: Project["status"] | "all";
  limit?: number;
}): Promise<ProjectWithRelations[]> {
  const client = await createClient();
  const limit = options?.limit ?? 50;

  let request = client
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options?.status && options.status !== "all") {
    request = request.eq("status", options.status);
  }

  const rawQuery = options?.query?.trim().slice(0, 100);
  if (rawQuery) {
    const term = rawQuery.replace(/[\\%_]/g, "\\$&");
    request = request.ilike("title", `%${term}%`);
  }

  const { data: projects, error } = await request;
  if (error) {
    throw new Error("Could not load projects");
  }

  if (!projects || projects.length === 0) {
    return [];
  }

  const projectIds = projects.map((p) => p.id);

  // Parallel fetch of relation junctions
  const [areaLinksRes, researcherLinksRes, pubLinksRes] = await Promise.all([
    client
      .from("project_research_areas")
      .select("project_id, research_area_id")
      .in("project_id", projectIds),
    client
      .from("researcher_projects")
      .select("project_id, researcher_id")
      .in("project_id", projectIds),
    client
      .from("publication_projects")
      .select("project_id, publication_id")
      .in("project_id", projectIds),
  ]);

  if (areaLinksRes.error || researcherLinksRes.error || pubLinksRes.error) {
    throw new Error("Could not load project relations");
  }

  const areaIds = Array.from(
    new Set(areaLinksRes.data.map((r) => r.research_area_id)),
  );
  const researcherIds = Array.from(
    new Set(researcherLinksRes.data.map((r) => r.researcher_id)),
  );
  const pubIds = Array.from(
    new Set(pubLinksRes.data.map((r) => r.publication_id)),
  );

  const [areasRes, researchersRes, pubsRes] = await Promise.all([
    areaIds.length
      ? client.from("research_areas").select("*").in("id", areaIds)
      : { data: [] as Area[], error: null },
    researcherIds.length
      ? client.from("researchers").select("*").in("id", researcherIds)
      : { data: [] as Researcher[], error: null },
    pubIds.length
      ? client
          .from("publications")
          .select("id")
          .eq("status", "published")
          .in("id", pubIds)
      : { data: [] as { id: string }[], error: null },
  ]);

  if (areasRes.error || researchersRes.error || pubsRes.error) {
    throw new Error("Could not load related entities for projects");
  }

  const areaMap = new Map((areasRes.data ?? []).map((a) => [a.id, a]));
  const researcherMap = new Map(
    (researchersRes.data ?? []).map((r) => [r.id, r]),
  );
  const publishedPubIds = new Set((pubsRes.data ?? []).map((p) => p.id));

  // Build lookup maps for each project
  const projectAreaMap = new Map<string, Area[]>();
  for (const link of areaLinksRes.data) {
    const area = areaMap.get(link.research_area_id);
    if (area) {
      const list = projectAreaMap.get(link.project_id) ?? [];
      list.push(area);
      projectAreaMap.set(link.project_id, list);
    }
  }

  const projectResearcherMap = new Map<string, Researcher[]>();
  for (const link of researcherLinksRes.data) {
    const researcher = researcherMap.get(link.researcher_id);
    if (researcher) {
      const list = projectResearcherMap.get(link.project_id) ?? [];
      list.push(researcher);
      projectResearcherMap.set(link.project_id, list);
    }
  }

  const projectPubCountMap = new Map<string, number>();
  for (const link of pubLinksRes.data) {
    if (publishedPubIds.has(link.publication_id)) {
      const count = projectPubCountMap.get(link.project_id) ?? 0;
      projectPubCountMap.set(link.project_id, count + 1);
    }
  }

  return projects.map((p) => ({
    ...p,
    areas: projectAreaMap.get(p.id) ?? [],
    researchers: projectResearcherMap.get(p.id) ?? [],
    publicationCount: projectPubCountMap.get(p.id) ?? 0,
  }));
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDetailData | null> {
  const client = await createClient();

  const { data: project, error } = await client
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load project");
  }

  if (!project) {
    return null;
  }

  const [areaLinksRes, researcherLinksRes, pubLinksRes] = await Promise.all([
    client
      .from("project_research_areas")
      .select("research_area_id")
      .eq("project_id", project.id),
    client
      .from("researcher_projects")
      .select("researcher_id")
      .eq("project_id", project.id),
    client
      .from("publication_projects")
      .select("publication_id")
      .eq("project_id", project.id),
  ]);

  if (areaLinksRes.error || researcherLinksRes.error || pubLinksRes.error) {
    throw new Error("Could not load project relations");
  }

  const areaIds = areaLinksRes.data.map((r) => r.research_area_id);
  const researcherIds = researcherLinksRes.data.map((r) => r.researcher_id);
  const pubIds = pubLinksRes.data.map((r) => r.publication_id);

  const [areasRes, researchersRes, pubsRes] = await Promise.all([
    areaIds.length
      ? client.from("research_areas").select("*").in("id", areaIds)
      : { data: [] as Area[], error: null },
    researcherIds.length
      ? client.from("researchers").select("*").in("id", researcherIds)
      : { data: [] as Researcher[], error: null },
    pubIds.length
      ? client
          .from("publications")
          .select("*")
          .eq("status", "published")
          .in("id", pubIds)
      : { data: [] as Publication[], error: null },
  ]);

  if (areasRes.error || researchersRes.error || pubsRes.error) {
    throw new Error("Could not load project linked entities");
  }

  return {
    project,
    areas: areasRes.data ?? [],
    researchers: researchersRes.data ?? [],
    publications: pubsRes.data ?? [],
  };
}
