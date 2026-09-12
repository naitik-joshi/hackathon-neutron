import "server-only";

import { requireRole } from "@/lib/auth/guards";
import {
  CHANGES_REQUESTED_STALE_DAYS,
  PROJECT_STALE_DAYS,
  REVIEW_STALE_DAYS,
} from "./constants";
import { buildAttentionItems, type AttentionItem } from "./rules";

export type AdminOverviewMetrics = {
  publishedPublications: number;
  pendingReviews: number;
  changesRequested: number;
  projects: number;
  needsAttention: number;
};

export type AdminOverview = {
  metrics: AdminOverviewMetrics;
  attention: AttentionItem[];
};

export async function getAdminOverview(): Promise<AdminOverview> {
  const { client } = await requireRole(["admin"]);
  const now = new Date();
  const cutoff = (days: number) =>
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

  const [
    publishedCount,
    pendingCount,
    changesCount,
    projectCount,
    staleReviewPublications,
    inactiveChangesPublications,
    attentionProjects,
  ] = await Promise.all([
    client
      .from("publications")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    client
      .from("publications")
      .select("id", { count: "exact", head: true })
      .in("status", ["submitted", "under_review"]),
    client
      .from("publications")
      .select("id", { count: "exact", head: true })
      .eq("status", "changes_requested"),
    client.from("projects").select("id", { count: "exact", head: true }),
    client
      .from("publications")
      .select("id,title,status,updated_at")
      .in("status", ["submitted", "under_review"])
      .lte("updated_at", cutoff(REVIEW_STALE_DAYS)),
    client
      .from("publications")
      .select("id,title,status,updated_at")
      .eq("status", "changes_requested")
      .lte("updated_at", cutoff(CHANGES_REQUESTED_STALE_DAYS)),
    client
      .from("projects")
      .select("id,title,slug,status,updated_at")
      .eq("status", "ongoing")
      .lte("updated_at", cutoff(PROJECT_STALE_DAYS)),
  ]);

  const results = [
    publishedCount,
    pendingCount,
    changesCount,
    projectCount,
    staleReviewPublications,
    inactiveChangesPublications,
    attentionProjects,
  ];
  if (results.some((result) => result.error)) {
    throw new Error("Could not load the research operations overview.");
  }

  const attention = buildAttentionItems(
    {
      publications: [
        ...(staleReviewPublications.data ?? []),
        ...(inactiveChangesPublications.data ?? []),
      ],
      projects: attentionProjects.data ?? [],
    },
    now,
  );

  return {
    metrics: {
      publishedPublications: publishedCount.count ?? 0,
      pendingReviews: pendingCount.count ?? 0,
      changesRequested: changesCount.count ?? 0,
      projects: projectCount.count ?? 0,
      needsAttention: attention.length,
    },
    attention,
  };
}
