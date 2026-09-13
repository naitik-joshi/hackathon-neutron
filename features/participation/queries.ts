import "server-only";
import { requireRole } from "@/lib/auth/guards";

export async function getMyInterests() {
  const { client, profile } = await requireRole([
    "student",
    "researcher",
    "admin",
  ]);
  const { data, error } = await client
    .from("project_interests")
    .select("*")
    .eq("student_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error("Could not load your interests.");
  return data;
}

export type MyInterestSummary = {
  id: string;
  contactEmail: string;
  message: string;
  isDemo: boolean;
  createdAt: string;
  project: { title: string; slug: string } | null;
};

export async function getMyInterestSummaries(): Promise<MyInterestSummary[]> {
  const interests = await getMyInterests();
  if (interests.length === 0) return [];

  const { client } = await requireRole(["student", "researcher", "admin"]);
  const projectIds = Array.from(
    new Set(interests.map((interest) => interest.project_id)),
  );
  const { data: projects, error } = await client
    .from("projects")
    .select("id,title,slug")
    .in("id", projectIds);
  if (error) throw new Error("Could not load the projects for your interests.");

  const projectsById = new Map(
    (projects ?? []).map((project) => [project.id, project]),
  );
  return interests.map((interest) => {
    const project = projectsById.get(interest.project_id);
    return {
      id: interest.id,
      contactEmail: interest.contact_email,
      message: interest.message,
      isDemo: interest.is_demo,
      createdAt: interest.created_at,
      project: project ? { title: project.title, slug: project.slug } : null,
    };
  });
}

export async function getInterestInbox() {
  const { client } = await requireRole(["admin"]);
  const { data, error } = await client
    .from("project_interests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error("Could not load project interests.");
  return data;
}

export type EnrichedProjectInterest = {
  id: string;
  project_id: string;
  student_id: string;
  contact_email: string;
  message: string;
  is_demo: boolean;
  created_at: string;
  project?: {
    title: string;
    slug: string;
    status: string;
  } | null;
  student?: {
    display_name: string;
    role: string;
  } | null;
};

export async function getEnrichedInterestInbox(): Promise<
  EnrichedProjectInterest[]
> {
  const { client } = await requireRole(["admin"]);
  const { data: rawInterests, error } = await client
    .from("project_interests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error("Could not load project interests.");
  if (!rawInterests || rawInterests.length === 0) return [];

  const projectIds = Array.from(new Set(rawInterests.map((i) => i.project_id)));
  const studentIds = Array.from(new Set(rawInterests.map((i) => i.student_id)));

  const [projectsResult, profilesResult] = await Promise.all([
    projectIds.length > 0
      ? client
          .from("projects")
          .select("id, title, slug, status")
          .in("id", projectIds)
      : Promise.resolve({ data: [] }),
    studentIds.length > 0
      ? client
          .from("profiles")
          .select("id, display_name, role")
          .in("id", studentIds)
      : Promise.resolve({ data: [] }),
  ]);

  const projectsMap = new Map(
    (projectsResult.data || []).map((p) => [p.id, p]),
  );
  const profilesMap = new Map(
    (profilesResult.data || []).map((p) => [p.id, p]),
  );

  return rawInterests.map((item) => ({
    ...item,
    project: projectsMap.get(item.project_id) || null,
    student: profilesMap.get(item.student_id) || null,
  }));
}
