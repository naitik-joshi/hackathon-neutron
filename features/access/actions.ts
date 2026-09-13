"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import {
  profileRoleSchema,
  researcherAccessRequestSchema,
  researcherAccessReviewSchema,
  type AccessActionState,
} from "./validation";

export async function requestResearcherAccess(
  _state: AccessActionState,
  form: FormData,
): Promise<AccessActionState> {
  const { client, profile } = await requireRole(["student"]);
  const parsed = researcherAccessRequestSchema.safeParse(
    Object.fromEntries(form),
  );
  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((issue) => issue.message).join(" "),
    };
  }

  const { error } = await client.from("researcher_access_requests").insert({
    ...parsed.data,
    user_id: profile.id,
  });
  if (error?.code === "23505") {
    return { error: "You already have a researcher request awaiting review." };
  }
  if (error) {
    return { error: "Your request could not be saved. Please try again." };
  }

  revalidatePath("/account");
  revalidatePath("/admin/access");
  return {
    success:
      "Your researcher access request was sent. Student access remains active while an administrator reviews it.",
  };
}

export async function reviewResearcherAccess(
  _state: AccessActionState,
  form: FormData,
): Promise<AccessActionState> {
  const { client } = await requireRole(["admin"]);
  const parsed = researcherAccessReviewSchema.safeParse(
    Object.fromEntries(form),
  );
  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((issue) => issue.message).join(" "),
    };
  }

  const { error } = await client.rpc("review_researcher_access_request", {
    p_id: parsed.data.id,
    p_decision: parsed.data.decision,
    p_note: parsed.data.note,
  });
  if (error) {
    return {
      error:
        "This request changed or could not be reviewed. Reload and try again.",
    };
  }

  revalidatePath("/admin/access");
  revalidatePath("/account");
  return {
    success:
      parsed.data.decision === "approved"
        ? "Researcher access approved."
        : "Researcher access request rejected.",
  };
}

export async function setProfileRole(
  _state: AccessActionState,
  form: FormData,
): Promise<AccessActionState> {
  const { client } = await requireRole(["admin"]);
  const parsed = profileRoleSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((issue) => issue.message).join(" "),
    };
  }

  const { error } = await client.rpc("admin_set_profile_role", {
    p_user_id: parsed.data.user_id,
    p_role: parsed.data.role,
  });
  if (error) {
    return {
      error:
        "The role could not be changed. Administrators cannot change their own role.",
    };
  }

  revalidatePath("/admin/access");
  return { success: `Account role changed to ${parsed.data.role}.` };
}
