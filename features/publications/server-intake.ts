import "server-only";

import mammoth from "mammoth";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database, Profile } from "@/lib/supabase/database.types";
import { parseArticleTemplate } from "./template-parser";

type ResearcherAuth = {
  client: SupabaseClient<Database>;
  profile: Profile;
};

export async function authorizeResearcherApi(): Promise<
  ResearcherAuth | { response: Response }
> {
  if (!isSupabaseConfigured()) {
    return {
      response: Response.json(
        { error: "Publication intake is not configured." },
        { status: 503 },
      ),
    };
  }

  const client = await createClient();
  const { data: claims, error: claimsError } = await client.auth.getClaims();
  if (claimsError || !claims?.claims.sub) {
    return {
      response: Response.json(
        { error: "Sign in is required." },
        { status: 401 },
      ),
    };
  }

  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("*")
    .eq("id", claims.claims.sub)
    .single();
  if (profileError || !profile) {
    return {
      response: Response.json(
        { error: "Your account profile could not be loaded." },
        { status: 403 },
      ),
    };
  }
  if (profile.role !== "researcher") {
    return {
      response: Response.json(
        { error: "Researcher access is required." },
        { status: 403 },
      ),
    };
  }

  return { client, profile };
}

export async function extractPublicationFromDocx(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await mammoth.extractRawText({ buffer });
  return parseArticleTemplate(result.value);
}

export function requestBodyTooLarge(request: Request, maxBytes: number) {
  const length = Number(request.headers.get("content-length"));
  return Number.isFinite(length) && length > maxBytes;
}
