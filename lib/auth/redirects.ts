import type { Role } from "@/lib/supabase/database.types";

const INTERNAL_ORIGIN = "https://rd-hub.invalid";

export function safeRedirectTo(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length === 0 || value.length > 2048) {
    return undefined;
  }
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return undefined;
  }
  try {
    const parsed = new URL(value, INTERNAL_ORIGIN);
    if (parsed.origin !== INTERNAL_ORIGIN) return undefined;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return undefined;
  }
}

export function getPostSignInRedirect(role: Role, requestedPath: unknown) {
  if (role === "admin") return "/admin";
  if (role === "researcher") return "/researcher";
  return safeRedirectTo(requestedPath) ?? "/account";
}

export function getPostSignUpRedirect(requestedPath: unknown) {
  return safeRedirectTo(requestedPath) ?? "/account?created=1";
}

export function authHref(
  route: "/auth/sign-in" | "/auth/sign-up",
  requestedPath: string,
) {
  const safePath = safeRedirectTo(requestedPath);
  return safePath
    ? `${route}?${new URLSearchParams({ redirectTo: safePath })}`
    : route;
}
