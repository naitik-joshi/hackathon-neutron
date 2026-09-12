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
