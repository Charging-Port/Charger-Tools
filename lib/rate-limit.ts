/**
 * Simple in-memory rate limiter.
 *
 * Limitations:
 * - State resets on server restart (acceptable for a single-process deployment on Vercel/serverless
 *   where each function instance is short-lived; for multi-instance, use Upstash Redis instead).
 * - Entries are keyed by IP + route; the map is cleaned on a 60-second interval.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Prune expired entries every minute to prevent unbounded memory growth
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      if (now > entry.resetAt) store.delete(key);
    });
  }, 60_000);
}

export interface RateLimitOptions {
  /** Maximum requests allowed within the window */
  limit: number;
  /** Window length in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check and record a rate-limit hit for `identifier`.
 * Call once per request; the counter is incremented on every call.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const { limit, windowMs } = options;
  const now = Date.now();

  const existing = store.get(identifier);

  if (!existing || now > existing.resetAt) {
    const entry: RateLimitEntry = { count: 1, resetAt: now + windowMs };
    store.set(identifier, entry);
    return { allowed: true, remaining: limit - 1, resetAt: entry.resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Extract the most reliable IP address from a Next.js request.
 *
 * Order of trust:
 *  1. `x-vercel-forwarded-for` — Vercel-edge-set and not spoofable through the
 *     edge proxy. Only present on Vercel.
 *  2. `req.ip` — exposed by NextRequest in production on Vercel, equivalent
 *     to (1). Read off the request type if available.
 *  3. The first hop of `x-forwarded-for` — fine when the app is fronted by
 *     a trusted proxy. In direct-to-origin scenarios this is spoofable.
 *  4. `"unknown"` — better than nothing; rate-limits all unknown clients
 *     under the same key.
 *
 * `x-real-ip` is intentionally NOT trusted: many origins set it but it is
 * routinely spoofable from the public Internet.
 */
export function getClientIp(req: Request): string {
  const vercel = req.headers.get("x-vercel-forwarded-for");
  if (vercel) {
    const first = vercel.split(",")[0].trim();
    if (first) return first;
  }

  // NextRequest exposes a typed `.ip` in production on Vercel. Fall back to
  // duck-typing so this module stays compatible with raw Request too.
  const maybeIp = (req as unknown as { ip?: string }).ip;
  if (typeof maybeIp === "string" && maybeIp.length > 0) return maybeIp;

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  return "unknown";
}
