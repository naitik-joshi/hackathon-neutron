"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  administratorInviteSchema,
  profileRoleSchema,
  researcherAccessRequestSchema,
  researcherAccessReviewSchema,
  type AccessActionState,
} from "./validation";

export async function inviteAdministrator(
  _state: AccessActionState,
  form: FormData,
): Promise<AccessActionState> {
  const { client } = await requireRole(["admin"]);
  const parsed = administratorInviteSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((issue) => issue.message).join(" "),
    };
  }

  let adminClient;
  try {
    adminClient = createAdminClient();
  } catch {
    return {
      error:
        "Administrator invitations are not configured on this server. Existing accounts can still be managed below.",
    };
  }

  const users = await adminClient.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (users.error) {
    return {
      error: "Existing accounts could not be checked. Try again later.",
    };
  }
  const existing = users.data.users.find(
    (user) => user.email?.trim().toLowerCase() === parsed.data.email,
  );

  if (parsed.data.mode === "invite" && existing) {
    return {
      error:
        "That email already has an account. Choose “Promote existing account” and confirm the role change.",
    };
  }
  if (parsed.data.mode === "promote" && !existing) {
    return {
      error:
        "No existing account uses that email. Choose “Invite new administrator” instead.",
    };
  }

  let userId = existing?.id;
  if (!userId) {
    const invitation = await adminClient.auth.admin.inviteUserByEmail(
      parsed.data.email,
      parsed.data.display_name
        ? { data: { display_name: parsed.data.display_name } }
        : undefined,
    );
    if (invitation.error || !invitation.data.user) {
      return {
        error:
          "The invitation could not be sent. The address may already be invited, or email delivery may be unavailable.",
      };
    }
    userId = invitation.data.user.id;
  }

  const promotion = await client.rpc("admin_set_profile_role", {
    p_user_id: userId,
    p_role: "admin",
  });
  if (promotion.error) {
    return {
      error:
        "The account exists, but administrator access could not be assigned. Review the account before retrying.",
    };
  }

  if (parsed.data.display_name) {
    const displayNameUpdate = await client
      .from("profiles")
      .update({ display_name: parsed.data.display_name })
      .eq("id", userId);
    if (displayNameUpdate.error) {
      revalidatePath("/admin/access");
      return {
        success:
          "Administrator access was assigned, but the display name could not be saved.",
      };
    }
  }

  revalidatePath("/admin/access");
  return {
    success: existing
      ? "The existing account is now an administrator."
      : "Administrator invitation sent and access assigned.",
  };
}

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
