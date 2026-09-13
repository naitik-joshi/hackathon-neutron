"use server";
import { requireRole } from "@/lib/auth/guards";
import { interestSchema } from "./validation";

export type InterestActionState = {
  error?: string;
  success?: string;
  code?: "already_submitted";
};

export async function expressInterest(
  _state: InterestActionState,
  form: FormData,
): Promise<InterestActionState> {
  const { client, profile } = await requireRole(["student"]);
  const parsed = interestSchema.safeParse({
    project_id: form.get("project_id"),
    contact_email: form.get("contact_email"),
    message: form.get("message"),
    is_demo: form.get("is_demo") === "on",
  });
  if (!parsed.success)
    return {
      error: parsed.error.issues.map((issue) => issue.message).join(" "),
    };
  const { error } = await client
    .from("project_interests")
    .insert({ ...parsed.data, student_id: profile.id });
  if (error?.code === "23505")
    return {
      success: "You have already expressed interest in this project.",
      code: "already_submitted",
    };
  if (error?.code === "23503")
    return { error: "This project is no longer available." };
  if (error)
    return { error: "Your interest could not be saved. Please try again." };
  return {
    success:
      "Your interest has been saved. An administrator can review your message.",
  };
}
