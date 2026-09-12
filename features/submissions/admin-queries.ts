import "server-only";
import { requireRole } from "@/lib/auth/guards";
import type { Publication, ProjectInterest } from "@/lib/supabase/database.types";

export type AdminDashboardData = {
  metrics: {
    submitted: number;
    underReview: number;
    changesRequested: number;
    published: number;
    rejected: number;
    totalInterestCount: number;
  };
  recentSubmissions: Publication[];
  recentInterests: ProjectInterest[];
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const { client } = await requireRole(["admin"]);

  const [pubsResult, interestsResult] = await Promise.all([
    client
      .from("publications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
    client
      .from("project_interests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  if (pubsResult.error) {
    throw new Error("Could not load administrative publication metrics.");
  }

  const publications = pubsResult.data || [];
  const interests = interestsResult.data || [];

  const metrics = {
    submitted: publications.filter((p) => p.status === "submitted").length,
    underReview: publications.filter((p) => p.status === "under_review").length,
    changesRequested: publications.filter((p) => p.status === "changes_requested").length,
    published: publications.filter((p) => p.status === "published").length,
    rejected: publications.filter((p) => p.status === "rejected").length,
    totalInterestCount: interests.length,
  };

  // Recent 6 submissions that require triage or review attention
  const recentSubmissions = publications
    .filter((p) => ["submitted", "under_review", "changes_requested"].includes(p.status))
    .slice(0, 6);

  return {
    metrics,
    recentSubmissions: recentSubmissions.length > 0 ? recentSubmissions : publications.slice(0, 6),
    recentInterests: interests.slice(0, 5),
  };
}
