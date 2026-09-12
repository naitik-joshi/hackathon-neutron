import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseConfig } from "./config";
export async function updateSession(request: NextRequest) {
 let response = NextResponse.next({ request });
 if (!isSupabaseConfigured()) return response;
 const { url, key } = supabaseConfig();
 const client = createServerClient(url, key, { cookies: {
  getAll: () => request.cookies.getAll(),
  setAll(values) {
   values.forEach(({ name, value }) => request.cookies.set(name, value));
   response = NextResponse.next({ request });
   values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  },
 } });
 await client.auth.getClaims();
 // Never cache a response that may contain a refreshed session.
 response.headers.set("Cache-Control", "private, no-store");
 return response;
}
