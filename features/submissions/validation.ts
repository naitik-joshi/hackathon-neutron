import { z } from "zod";

export const reviewSchema = z
  .object({
    id: z.uuid(),
    decision: z.enum([
      "under_review",
      "published",
      "changes_requested",
      "rejected",
    ]),
    note: z.string().trim().max(4000).default(""),
  })
  .superRefine((value, ctx) => {
    if (
      ["changes_requested", "rejected"].includes(value.decision) &&
      value.note.length < 3
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["note"],
        message:
          "Explain the requested changes or reason for rejection (at least 3 characters).",
      });
    }
  });
