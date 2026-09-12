import { QwenClientError } from "./errors.ts";

export function validateQwenConfig(rawUrl?: string, rawApiKey?: string) {
  const value = rawUrl?.trim();
  const apiKey = rawApiKey?.trim();
  if (!value || !apiKey || apiKey.length < 32) {
    throw new QwenClientError(
      503,
      "SERVICE_UNAVAILABLE",
      "The research assistant is not configured.",
      false,
    );
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new QwenClientError(
      503,
      "SERVICE_UNAVAILABLE",
      "The research assistant is not configured.",
      false,
    );
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new QwenClientError(
      503,
      "SERVICE_UNAVAILABLE",
      "The research assistant is not configured.",
      false,
    );
  }

  return { baseUrl: url.toString().replace(/\/$/, ""), apiKey };
}
