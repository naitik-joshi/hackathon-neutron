"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signInSchema, signUpSchema, type AuthActionState } from "./validation";

export async function signIn(
  _state: AuthActionState,
  form: FormData,
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return { fieldErrors: parsed.error.flatten().fieldErrors };
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
        : "/account",
  );
}

export async function signUp(
  _state: AuthActionState,
  form: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    email: form.get("email"),
    password: form.get("password"),
    confirmPassword: form.get("confirmPassword"),
  });
  if (!parsed.success)
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  if (!isSupabaseConfigured())
    return {
      error:
        "Account creation is not configured yet. Contact the project team.",
    };

  const client = await createClient();
  const { data, error } = await client.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error)
    return {
      error:
        "We could not create your account. Check the details or try signing in if you already registered.",
    };

  if (data.session) redirect("/account?created=1");

  return {
    success:
      "Check your email to confirm your account, then return here to sign in.",
  };
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const client = await createClient();
    const { error } = await client.auth.signOut();
    if (error) throw new Error("Sign out failed. Please try again.");
  }
  redirect("/auth/sign-in");
}
