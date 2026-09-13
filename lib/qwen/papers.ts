import { z } from "zod";
import { QwenClientError } from "./errors.ts";
import type { PapersResponse } from "./types.ts";

const paperSchema = z.object({
  filename: z.string().min(1).max(255),
  title: z.string().min(1).max(500),
  section_count: z.number().int().nonnegative(),
  sections: z.array(z.string().min(1).max(200)).max(100),
});

const papersResponseSchema = z.object({
  status: z.literal("success"),
  count: z.number().int().nonnegative(),
  papers: z.array(paperSchema).max(500),
});

export function parsePapersResponse(value: unknown): PapersResponse {
  const parsed = papersResponseSchema.safeParse(value);
  if (!parsed.success || parsed.data.count !== parsed.data.papers.length) {
    throw new QwenClientError(
      503,
      "SERVICE_UNAVAILABLE",
      "The indexed paper list is temporarily unavailable.",
      true,
    );
  }
  return parsed.data;
}
