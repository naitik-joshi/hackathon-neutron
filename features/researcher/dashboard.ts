import type { Publication } from "../../lib/supabase/database.types.ts";

export type ResearcherDashboardPublication = Pick<
  Publication,
  | "id"
  | "title"
  | "slug"
  | "status"
  | "submitted_by"
  | "created_at"
  | "updated_at"
  | "is_demo"
>;

export function getResearcherDisplayName(displayName: string) {
  return displayName.trim() || "Researcher";
}

export function buildNeedsYourAction(
  records: ResearcherDashboardPublication[],
  researcherId: string,
) {
  return records
    .filter(
      (record) =>
        record.submitted_by === researcherId &&
        record.status === "changes_requested",
    )
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
}
