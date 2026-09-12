import { z } from "zod";
export const publicationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Use at least 3 characters for the title.")
    .max(240),
  abstract: z
    .string()
    .trim()
    .min(20, "Use at least 20 characters for the abstract.")
    .max(12000),
  doi: z
    .string()
    .trim()
    .max(200)
    .refine(
      (v) => !v || /^10\.\d{4,9}\/\S+$/.test(v),
      "Use a DOI such as 10.1234/example, without a URL.",
    )
    .transform((v) => v || null),
  year: z.union([
    z.literal("").transform(() => null),
    z.coerce.number().int().min(1900).max(2100),
  ]),
  is_demo: z.boolean(),
});
export type ActionState = { error?: string };
