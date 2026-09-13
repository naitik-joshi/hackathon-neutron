import "server-only";

import { requireRole } from "@/lib/auth/guards";
import type {
  Profile,
  ResearcherAccessRequest,
} from "@/lib/supabase/database.types";

export async function getMyLatestResearcherAccessRequest() {
  const { client, profile } = await requireRole(["student"]);
  const { data, error } = await client
    .from("researcher_access_requests")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error("Could not load your researcher access request.");
  return data as ResearcherAccessRequest | null;
}

export async function getAdminAccessData() {
  const { client, profile } = await requireRole(["admin"]);
  const [requestsResult, profilesResult] = await Promise.all([
    client
      .from("researcher_access_requests")
      .select("*")
      .order("created_at", { ascending: false }),
    client
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);
  if (requestsResult.error || profilesResult.error) {
    throw new Error("Could not load account access records.");
  }
  return {
    currentAdminId: profile.id,
    requests: (requestsResult.data || []) as ResearcherAccessRequest[],
    profiles: (profilesResult.data || []) as Profile[],
  };
}
