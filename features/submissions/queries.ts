import "server-only";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";

export async function getPublicationReviews(publicationId: string) {
  const id = z.uuid().parse(publicationId);
  const { client } = await requireRole(["researcher", "admin"]);
  const { data, error } = await client
    .from("publication_reviews")
    .select("*")
    .eq("publication_id", id)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error("Could not load review feedback.");
  return data;
}
