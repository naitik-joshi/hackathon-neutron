import { z } from "zod";

const query = z
  .string()
  .catch("")
  .transform((value) => value.trim().slice(0, 100));

export const directorySearchSchema = z.object({ q: query });
export const projectSearchSchema = directorySearchSchema.extend({
  status: z
    .enum(["all", "proposed", "ongoing", "completed", "archived"])
    .catch("all"),
});
