"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import {
  publicationSchema,
  type ActionState,
} from "@/lib/validation/publication";
export async function submitPublication(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const { client, profile } = await requireRole(["researcher"]);
  const parsed = publicationSchema.safeParse({
    title: form.get("title"),
    abstract: form.get("abstract"),
    doi: form.get("doi"),
    year: form.get("year"),
    is_demo: form.get("is_demo") === "on",
  });
  if (!parsed.success)
    return { error: parsed.error.issues.map((i) => i.message).join(" ") };
  const slug = `${
    parsed.data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 70) || "publication"
  }-${crypto.randomUUID()}`;
  const { error } = await client
    .from("publications")
    .insert({
      ...parsed.data,
      slug,
      submitted_by: profile.id,
      status: "submitted",
    });
  if (error)
    return { error: "Your submission could not be saved. Please try again." };
  revalidatePath("/researcher/publications");
  redirect("/researcher/publications?submitted=1");
}
