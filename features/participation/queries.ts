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

export async function getEnrichedInterestInbox(): Promise<EnrichedProjectInterest[]> {
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
