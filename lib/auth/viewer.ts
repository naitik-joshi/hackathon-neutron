import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Role } from "@/lib/supabase/database.types";

export type Viewer = {
  id: string;
  displayName: string;
  role: Role;
};

export async function getViewer(): Promise<Viewer | null> {
  if (!isSupabaseConfigured()) return null;
  const client = await createClient();
  const { data: claims, error: claimsError } = await client.auth.getClaims();
  const id = claims?.claims?.sub;
  if (claimsError || !id) return null;

  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("display_name, role")
    .eq("id", id)
    .maybeSingle();
  if (profileError || !profile) return null;

  return {
    id,
    displayName: profile.display_name,
    role: profile.role,
  };
}
