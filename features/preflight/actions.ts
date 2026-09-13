"use server";

import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { analyzePublicationPreflight } from "./analyze";
import { loadPreflightReferenceData } from "./queries";
import type { PreflightActionState } from "./types";

const preflightInputSchema = z.object({
  title: z.string().trim().min(3).max(240),
  abstract: z.string().trim().min(20).max(12000),
  referencesText: z.string().max(30000),
  currentPublicationId: z.uuid().optional(),
});

export async function runPublicationPreflight(input: {
  title: string;
  abstract: string;
  referencesText: string;
  currentPublicationId?: string;
}): Promise<PreflightActionState> {
  const { client } = await requireRole(["researcher"]);
  const parsed = preflightInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error:
        "Add a title of at least 3 characters and an abstract of at least 20 characters before running readiness.",
    };
  }

  try {
    const referenceData = await loadPreflightReferenceData(client);
    return {
      data: analyzePublicationPreflight({
        ...parsed.data,
        ...referenceData,
      }),
    };
  } catch {
    return {
      error:
        "Submission readiness is temporarily unavailable. You can still submit for administrative review.",
    };
  }
}
