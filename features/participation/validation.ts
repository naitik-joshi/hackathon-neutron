import { z } from "zod";

export const interestSchema = z.object({
  project_id: z.uuid(),
  contact_email: z.string().trim().email().max(254).toLowerCase(),
  message: z
    .string()
    .trim()
    .min(20, "Explain your interest in at least 20 characters.")
    .max(2000),
  is_demo: z.boolean(),
});
