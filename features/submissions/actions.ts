"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import type { ActionState } from "@/lib/validation/publication";
export async function reviewPublication(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const { client } = await requireRole(["admin"]);
  const parsed = z
    .object({
      id: z.uuid(),
      decision: z.enum([
        "under_review",
        "published",
        "changes_requested",
        "rejected",
      ]),
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Invalid review request." };
  const { id, decision } = parsed.data;
  const expected = decision === "under_review" ? "submitted" : "under_review";
  const { data, error } = await client
    .from("publications")
    .update({ status: decision })
    .eq("id", id)
    .eq("status", expected)
    .select("slug")
    .maybeSingle();
  if (error || !data)
    return {
      error:
        "This submission changed or the update failed. Reload and check its status before trying again.",
    };
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${id}`);
  revalidatePath("/researcher/publications");
  revalidatePath("/publications");
  revalidatePath(`/publications/${data.slug}`);
  revalidatePath("/");
  redirect(`/admin/submissions/${id}?updated=1`);
}
