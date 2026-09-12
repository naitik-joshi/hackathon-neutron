import "server-only";

import { QwenClientError } from "./errors.ts";
import { validateQwenConfig } from "./config.ts";
import type {
  CompareResponse,
  HealthResponse,
  PapersResponse,
  QueryResponse,
  RecommendResponse,
} from "./types.ts";
import type {
  CompareRequest,
  QueryRequest,
  RecommendRequest,
} from "./schemas.ts";

const SHORT_TIMEOUT_MS = 12_000;
const INFERENCE_TIMEOUT_MS = 165_000;

export function readQwenConfig() {
  return validateQwenConfig(
    process.env.QWEN_BACKEND_URL,
    process.env.QWEN_API_KEY,
  );
}

function mapBackendError(status: number, payload: unknown): QwenClientError {
  const backendError =
    payload && typeof payload === "object" && "error" in payload
      ? (payload as { error?: unknown }).error
      : undefined;
  const details =
    backendError && typeof backendError === "object"
      ? (backendError as Record<string, unknown>)
      : {};
  const reportedCode =
    typeof details.code === "string" ? details.code : "UPSTREAM_ERROR";
  const retryable = details.retryable === true || status >= 500;

  if (status === 401) {
    return new QwenClientError(
      503,
      "SERVICE_UNAVAILABLE",
      "The research assistant is temporarily unavailable.",
      true,
    );
  }
  const safeErrors: Record<string, string> = {
    INVALID_JSON: "The request body was invalid.",
    INVALID_REQUEST: "The request was invalid.",
    INVALID_FIELD: "One of the request fields was invalid.",
    MISSING_FIELD: "A required request field was missing.",
    FIELD_TOO_LONG: "One of the request fields was too long.",
    PAPER_NOT_FOUND:
      "The selected paper is not available in the grounded index.",
    SECTION_NOT_FOUND:
      "The selected section is not available for this request.",
    PAYLOAD_TOO_LARGE: "The request was too large.",
    MODEL_UNAVAILABLE: "The research assistant is temporarily unavailable.",
  };
  const code = reportedCode in safeErrors ? reportedCode : "UPSTREAM_ERROR";
  return new QwenClientError(
    status >= 400 && status <= 599 ? status : 503,
    code,
    safeErrors[code] ||
      "The research assistant could not complete the request.",
    retryable,
  );
}

async function qwenFetch<T>(
  path: string,
  options: { body?: unknown; timeoutMs: number; authenticated?: boolean },
): Promise<T> {
  const config = readQwenConfig();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);

  try {
    const response = await fetch(`${config.baseUrl}${path}`, {
      method: options.body === undefined ? "GET" : "POST",
      headers: {
        ...(options.body === undefined
          ? {}
          : { "Content-Type": "application/json" }),
        ...(options.authenticated === false
          ? {}
          : { "X-API-Key": config.apiKey }),
      },
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
      signal: controller.signal,
    });
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) throw mapBackendError(response.status, payload);
    return payload as T;
  } catch (error) {
    if (error instanceof QwenClientError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new QwenClientError(
        503,
        "MODEL_UNAVAILABLE",
        "The research assistant took too long to respond.",
        true,
      );
    }
    throw new QwenClientError(
      503,
      "SERVICE_UNAVAILABLE",
      "The research assistant is temporarily unavailable.",
      true,
    );
  } finally {
    clearTimeout(timer);
  }
}

export const qwenClient = {
  papers: () =>
    qwenFetch<PapersResponse>("/api/papers", { timeoutMs: SHORT_TIMEOUT_MS }),
  health: () =>
    qwenFetch<HealthResponse>("/api/health", {
      timeoutMs: SHORT_TIMEOUT_MS,
      authenticated: false,
    }),
  query: (body: QueryRequest) =>
    qwenFetch<QueryResponse>("/api/query", {
      body,
      timeoutMs: INFERENCE_TIMEOUT_MS,
    }),
  recommend: (body: RecommendRequest) =>
    qwenFetch<RecommendResponse>("/api/recommend", {
      body,
      timeoutMs: SHORT_TIMEOUT_MS,
    }),
  compare: (body: CompareRequest) =>
    qwenFetch<CompareResponse>("/api/compare", {
      body,
      timeoutMs: INFERENCE_TIMEOUT_MS,
    }),
};
