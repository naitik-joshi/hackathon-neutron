import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../lib/supabase/database.types.ts";

// Public routes must stay published-only even when the caller is an owner/admin.
// The server-only query layer supplies the caller's normal Supabase client.
export async function findPublishedPublication(
  client: SupabaseClient<Database>,
  slug: string,
) {
  const { data, error } = await client
    .from("publications")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error("Could not load publication");
  return data;
}

export async function findAreaConnections(
  client: SupabaseClient<Database>,
  slug: string,
) {
  const { data: area, error } = await client
    .from("research_areas")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error("Could not load research area");
  if (!area) return null;
  const [researcherLinks, projectLinks] = await Promise.all([
    client
      .from("researcher_research_areas")
      .select("researcher_id")
      .eq("research_area_id", area.id),
    client
      .from("project_research_areas")
      .select("project_id")
      .eq("research_area_id", area.id),
  ]);
  if (researcherLinks.error || projectLinks.error)
    throw new Error("Could not load area connections");
  const researcherIds = researcherLinks.data.map((link) => link.researcher_id);
  const projectIds = projectLinks.data.map((link) => link.project_id);
  const [researchers, projects, publicationLinks] = await Promise.all([
    researcherIds.length
      ? client
          .from("researchers")
          .select("*")
          .in("id", researcherIds)
          .order("name")
      : { data: [], error: null },
    projectIds.length
      ? client.from("projects").select("*").in("id", projectIds).order("title")
      : { data: [], error: null },
    projectIds.length
      ? client
          .from("publication_projects")
          .select("publication_id")
          .in("project_id", projectIds)
      : { data: [], error: null },
  ]);
  if (researchers.error || projects.error || publicationLinks.error)
    throw new Error("Could not load area records");
  // There is no publication-area junction: outputs connect through this area's projects.
  const publicationIds = [
    ...new Set(publicationLinks.data.map((link) => link.publication_id)),
  ];
  const publications = publicationIds.length
    ? await client
        .from("publications")
        .select("*")
        .eq("status", "published")
        .in("id", publicationIds)
        .order("published_at", { ascending: false })
    : { data: [], error: null };
  if (publications.error) throw new Error("Could not load area publications");
  return {
    area,
    researchers: researchers.data,
    projects: projects.data,
    publications: publications.data,
  };
}
