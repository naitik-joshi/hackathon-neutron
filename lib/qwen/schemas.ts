import { z } from "zod";

const paperName = z.string().trim().min(1).max(255);
const section = z.string().trim().min(1).max(200).optional();
const question = z.string().trim().min(3).max(2000);

export const queryRequestSchema = z
  .object({
    paper_name: paperName,
    section,
    question,
  })
  .strict();

export const recommendRequestSchema = z
  .object({ current_paper: paperName })
  .strict();

export const compareRequestSchema = z
  .object({
    paper_1: paperName,
    paper_2: paperName,
    section,
    question,
  })
  .strict()
  .refine((value) => value.paper_1 !== value.paper_2, {
    message: "Choose two different papers.",
    path: ["paper_2"],
  });

export type QueryRequest = z.infer<typeof queryRequestSchema>;
export type RecommendRequest = z.infer<typeof recommendRequestSchema>;
export type CompareRequest = z.infer<typeof compareRequestSchema>;
