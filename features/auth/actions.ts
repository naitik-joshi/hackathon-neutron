"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ActionState } from "@/lib/validation/publication";
export async function signIn(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({ email: z.email().max(254), password: z.string().min(1).max(256) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Enter a valid email and password." };
  if (!isSupabaseConfigured())
    return {
      error: "Sign in is not configured yet. Contact the project team.",
    };
  const client = await createClient();
  const { error } = await client.auth.signInWithPassword(parsed.data);
  if (error)
    return {
      error: "Sign in failed. Check your email and password, then try again.",
    };
  const { data: claims } = await client.auth.getClaims();
  const { data: profile } = await client
    .from("profiles")
    .select("role")
    .eq("id", claims?.claims.sub ?? "")
    .maybeSingle();
  redirect(
    profile?.role === "admin"
      ? "/admin"
      : profile?.role === "researcher"
        ? "/researcher"
        : "/research",
  );
}
export async function signOut() {
  if (isSupabaseConfigured()) {
    const client = await createClient();
    const { error } = await client.auth.signOut();
    if (error) throw new Error("Sign out failed. Please try again.");
  }
  redirect("/auth/sign-in");
}
