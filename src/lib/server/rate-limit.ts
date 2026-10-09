const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(
  request: Request,
  key: string,
  limit: number,
  windowMs = 60_000,
): { ok: boolean } {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();
  const entry = buckets.get(bucketKey);
  if (!entry || now > entry.reset) {
    buckets.set(bucketKey, { count: 1, reset: now + windowMs });
    return { ok: true };
  }
  entry.count += 1;
  return { ok: entry.count <= limit };
}
