import "server-only";

import type { Publication } from "@/lib/supabase/database.types";
import { requireRole } from "@/lib/auth/guards";
import { analyzeSavedPublicationContext } from "./analyze";
import { loadPreflightReferenceData } from "./queries";

export async function getAdminPublicationResearchContext(
  publication: Publication,
) {
  const { client } = await requireRole(["admin"]);
  const referenceData = await loadPreflightReferenceData(client);
  return analyzeSavedPublicationContext({
    title: publication.title,
    abstract: publication.abstract,
    currentPublicationId: publication.id,
    ...referenceData,
  });
}
