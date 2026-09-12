import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../lib/supabase/database.types";
import type { EditPublicationInput } from "../../lib/validation/publication";

export const editablePublicationStatuses = [
  "draft",
  "changes_requested",
] as const;

export async function resubmitOwnedPublication(
  client: SupabaseClient<Database>,
  ownerId: string,
  input: EditPublicationInput,
) {
  const { id, ...changes } = input;

  return client
    .from("publications")
    .update({ ...changes, status: "submitted" })
    .eq("id", id)
    .eq("submitted_by", ownerId)
    .in("status", [...editablePublicationStatuses])
    .select("slug")
    .maybeSingle();
}
