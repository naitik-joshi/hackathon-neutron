"use server";
import { reviewSchema } from "./validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import type { ActionState } from "@/lib/validation/publication";
export async function reviewPublication(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const { client } = await requireRole(["admin"]);
  const parsed = reviewSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return {
      error: parsed.error.issues.map((issue) => issue.message).join(" "),
    };
  const { id, decision, note } = parsed.data;
  const { data, error } = await client.rpc("review_publication", {
    p_id: id,
    p_decision: decision,
    p_note: note,
  });
  if (error || !data)
    return {
      error:
        "This submission changed or the update failed. Reload and check its status before trying again.",
    };
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${id}`);
  revalidatePath("/researcher/publications");
  revalidatePath("/publications");
  revalidatePath(`/publications/${data}`);
  revalidatePath("/");
  redirect(`/admin/submissions/${id}?updated=1`);
}
