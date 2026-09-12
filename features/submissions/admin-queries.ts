import "server-only";
import { requireRole } from "@/lib/auth/guards";
import type {
  Publication,
  ProjectInterest,
} from "@/lib/supabase/database.types";

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

export type SubmissionWithSubmitter = Publication & {
  submitterName: string | null;
};

export type SubmissionsQueueResult = {
  items: SubmissionWithSubmitter[];
  counts: {
    active: number;
    submitted: number;
    underReview: number;
    changesRequested: number;
    published: number;
    rejected: number;
    all: number;
  };
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
    changesRequested: publications.filter(
      (p) => p.status === "changes_requested",
    ).length,
    published: publications.filter((p) => p.status === "published").length,
    rejected: publications.filter((p) => p.status === "rejected").length,
    totalInterestCount: interests.length,
  };

  // Recent submissions that require triage or review attention
  const recentSubmissions = publications
    .filter((p) =>
      ["submitted", "under_review", "changes_requested"].includes(p.status),
    )
    .slice(0, 6);

  return {
    metrics,
    recentSubmissions:
      recentSubmissions.length > 0 ? recentSubmissions : publications.slice(0, 6),
    recentInterests: interests.slice(0, 5),
  };
}

export async function getAdminSubmissions(options?: {
  status?: string;
  query?: string;
}): Promise<SubmissionsQueueResult> {
  const { client } = await requireRole(["admin"]);

  // Fetch all submissions for accurate telemetry counts
  const { data: allPubs, error } = await client
    .from("publications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw new Error("Could not load administrative review queue.");
  }

  const publications = allPubs || [];

  const counts = {
    all: publications.length,
    active: publications.filter((p) =>
      ["submitted", "under_review", "changes_requested"].includes(p.status),
    ).length,
    submitted: publications.filter((p) => p.status === "submitted").length,
    underReview: publications.filter((p) => p.status === "under_review").length,
    changesRequested: publications.filter(
      (p) => p.status === "changes_requested",
    ).length,
    published: publications.filter((p) => p.status === "published").length,
    rejected: publications.filter((p) => p.status === "rejected").length,
  };

  const statusFilter = options?.status || "active";
  const search = options?.query?.trim().toLowerCase() || "";

  let filtered = publications;

  if (statusFilter === "active") {
    filtered = filtered.filter((p) =>
      ["submitted", "under_review", "changes_requested"].includes(p.status),
    );
  } else if (statusFilter !== "all") {
    filtered = filtered.filter((p) => p.status === statusFilter);
  }

  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.abstract.toLowerCase().includes(search) ||
        (p.doi && p.doi.toLowerCase().includes(search)),
    );
  }

  // Look up submitter profiles
  const submitterIds = Array.from(
    new Set(filtered.map((p) => p.submitted_by).filter(Boolean)),
  ) as string[];

  let profileMap = new Map<string, string>();
  if (submitterIds.length > 0) {
    const { data: profiles } = await client
      .from("profiles")
      .select("id, display_name")
      .in("id", submitterIds);

    if (profiles) {
      profileMap = new Map(
        profiles.map((pr) => [pr.id, pr.display_name || "Author"]),
      );
    }
  }

  const items: SubmissionWithSubmitter[] = filtered.map((p) => ({
    ...p,
    submitterName: p.submitted_by ? profileMap.get(p.submitted_by) || null : null,
  }));

  return { items, counts };
}
