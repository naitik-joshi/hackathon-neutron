import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Role } from "@/lib/supabase/database.types";
export async function requireRole(roles: Role[]) {
 if (!isSupabaseConfigured()) redirect("/auth/sign-in?message=setup");
 const client = await createClient();
 const { data, error } = await client.auth.getClaims();
 if (error || !data?.claims?.sub) redirect("/auth/sign-in");
 const { data: profile, error: profileError } = await client.from("profiles").select("*").eq("id", data.claims.sub).single();
 if (profileError) throw new Error("Unable to load your profile. Please try again or contact an administrator.");
 if (!roles.includes(profile.role)) redirect("/auth/forbidden");
 return { client, profile };
}
