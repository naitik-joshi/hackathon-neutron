type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

export function takeRateLimit(
  key: string,
  limit: number,
  windowMs = 60_000,
  now = Date.now(),
) {
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    const entry = { count: 1, resetAt: now + windowMs };
    buckets.set(key, entry);
    return { allowed: true, remaining: limit - 1, resetAt: entry.resetAt };
  }
  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }
  current.count += 1;
  return {
    allowed: true,
    remaining: limit - current.count,
    resetAt: current.resetAt,
  };
}

export function requestIdentifier(request: Request) {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function clearRateLimitsForTests() {
  buckets.clear();
}
