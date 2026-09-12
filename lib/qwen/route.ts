import { z } from "zod";
import { QwenClientError, safeQwenError } from "./errors.ts";
import { requestIdentifier, takeRateLimit } from "./rate-limit.ts";

const MAX_BODY_BYTES = 32 * 1024;

export const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

export function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { status, headers: noStoreHeaders });
}

export async function parseJson<T>(request: Request, schema: z.ZodType<T>) {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    throw new QwenClientError(
      413,
      "PAYLOAD_TOO_LARGE",
      "Request body must not exceed 32 KiB.",
    );
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    throw new QwenClientError(
      413,
      "PAYLOAD_TOO_LARGE",
      "Request body must not exceed 32 KiB.",
    );
  }
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new QwenClientError(
      400,
      "INVALID_JSON",
      "Request body must be valid JSON.",
    );
  }
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new QwenClientError(
      400,
      "INVALID_REQUEST",
      result.error.issues[0]?.message || "Request input is invalid.",
    );
  }
  return result.data;
}

export function enforceRateLimit(
  request: Request,
  scope: string,
  limit: number,
) {
  const result = takeRateLimit(`${scope}:${requestIdentifier(request)}`, limit);
  if (!result.allowed) {
    throw new QwenClientError(
      429,
      "RATE_LIMITED",
      "Too many requests. Please wait before trying again.",
      true,
    );
  }
}

export function routeError(error: unknown) {
  const safe = safeQwenError(error);
  const status = error instanceof QwenClientError ? error.status : 503;
  return jsonResponse(safe, status);
}
