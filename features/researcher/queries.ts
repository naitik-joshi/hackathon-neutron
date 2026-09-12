import "server-only";

import { requireRole } from "@/lib/auth/guards";
import type { PublicationStatus } from "@/lib/supabase/database.types";
import {
  buildNeedsYourAction,
  getResearcherDisplayName,
  type ResearcherDashboardPublication,
} from "./dashboard";

export type ResearcherDashboardMetrics = {
  total: number;
  submitted: number;
  underReview: number;
  changesRequested: number;
  published: number;
  rejected: number;
};

export type ResearcherDashboardData = {
  identity: {
    displayName: string;
    role: "researcher";
    publicProfile: {
      name: string;
      slug: string;
      position: string;
      isDemo: boolean;
    } | null;
  };
  metrics: ResearcherDashboardMetrics;
  needsAction: ResearcherDashboardPublication[];
  recentSubmissions: ResearcherDashboardPublication[];
};

const publicationFields =
  "id,title,slug,status,submitted_by,created_at,updated_at,is_demo" as const;

export async function getResearcherDashboard(): Promise<ResearcherDashboardData> {
  const { client, profile } = await requireRole(["researcher"]);

  const countFor = (status?: PublicationStatus) => {
    let query = client
      .from("publications")
      .select("id", { count: "exact", head: true })
      .eq("submitted_by", profile.id);
    if (status) query = query.eq("status", status);
    return query;
  };

  const [
    total,
    submitted,
    underReview,
    changesRequested,
    published,
    rejected,
    actionResult,
    recentResult,
    publicProfileResult,
  ] = await Promise.all([
    countFor(),
    countFor("submitted"),
    countFor("under_review"),
    countFor("changes_requested"),
    countFor("published"),
    countFor("rejected"),
    client
      .from("publications")
      .select(publicationFields)
      .eq("submitted_by", profile.id)
      .eq("status", "changes_requested")
      .order("updated_at", { ascending: false })
      .limit(20),
    client
      .from("publications")
      .select(publicationFields)
      .eq("submitted_by", profile.id)
      .order("updated_at", { ascending: false })
      .limit(6),
    client
      .from("researchers")
      .select("name,slug,position,is_demo")
      .eq("user_id", profile.id)
      .maybeSingle(),
  ]);

  const results = [
    total,
    submitted,
    underReview,
    changesRequested,
    published,
    rejected,
    actionResult,
    recentResult,
    publicProfileResult,
  ];
  if (results.some((result) => result.error)) {
    throw new Error("Could not load the researcher workspace.");
  }

  const publicProfile = publicProfileResult.data;

  return {
    identity: {
      displayName: getResearcherDisplayName(profile.display_name),
      role: "researcher",
      publicProfile: publicProfile
        ? {
            name: publicProfile.name,
            slug: publicProfile.slug,
            position: publicProfile.position,
            isDemo: publicProfile.is_demo,
          }
        : null,
    },
    metrics: {
      total: total.count ?? 0,
      submitted: submitted.count ?? 0,
      underReview: underReview.count ?? 0,
      changesRequested: changesRequested.count ?? 0,
      published: published.count ?? 0,
      rejected: rejected.count ?? 0,
    },
    needsAction: buildNeedsYourAction(actionResult.data ?? [], profile.id),
    recentSubmissions: recentResult.data ?? [],
  };
}
