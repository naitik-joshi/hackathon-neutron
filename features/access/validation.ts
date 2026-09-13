import { z } from "zod";

export const researcherAccessRequestSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name.").max(160),
  contact_email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid contact email.")
    .max(254),
  position: z.string().trim().min(2, "Enter your position.").max(160),
  affiliation: z.string().trim().min(2, "Enter your affiliation.").max(240),
  reason: z
    .string()
    .trim()
    .min(20, "Explain your research need in at least 20 characters.")
    .max(2000),
});

export const researcherAccessReviewSchema = z.object({
  id: z.uuid(),
  decision: z.enum(["approved", "rejected"]),
  note: z.string().trim().max(2000).default(""),
});

export const profileRoleSchema = z.object({
  user_id: z.uuid(),
  role: z.enum(["student", "researcher", "admin"]),
});

export type AccessActionState = { error?: string; success?: string };
