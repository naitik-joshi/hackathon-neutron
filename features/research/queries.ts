import "server-only";
import { createClient } from "@/lib/supabase/server";
export async function listAreas() {
  const client = await createClient();
  const { data, error } = await client
    .from("research_areas")
    .select("*")
    .order("name")
    .limit(100);
  if (error) throw new Error("Could not load research areas");
  return data;
}
export async function listPublications(query = "", limit = 50) {
  const client = await createClient();
  let request = client
    .from("publications")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  // Bound user input and escape LIKE wildcards. No interpolated PostgREST filter grammar.
  const term = query
    .trim()
    .slice(0, 100)
    .replace(/[\\%_]/g, "\\$&");
  if (term) request = request.ilike("title", `%${term}%`);
  const { data, error } = await request;
  if (error) throw new Error("Could not load published research");
  return data;
}
