import { NextRequest, NextResponse } from "next/server";
import { isValidSession, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyCsrf } from "@/lib/csrf";
import { isStorageWritable } from "@/lib/storage";
import { setScope, type Scope } from "@/lib/content";
import { logAdminAction } from "@/lib/audit";

export const dynamic = "force-dynamic";

const VALID_SCOPES: Scope[] = ["hero", "about", "now", "products", "blog"];

const MAX_BODY_BYTES = 1_000_000; // 1 MB cap on inbound JSON

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return isValidSession(token);
}

/** Reject cross-origin write requests as a second line of defense beyond CSRF. */
function isSameOriginWrite(req: NextRequest): boolean {
  const host = req.headers.get("host");
  if (!host) return false;
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }
  return false;
}

function applyAdminRateLimit(req: NextRequest): NextResponse | null {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`admin:${ip}`, {
    limit: 60,
    windowMs: 60 * 1000,
  });
  if (rl.allowed) return null;
  return NextResponse.json(
    { error: "Too many requests" },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
      },
    }
  );
}

/**
 * PATCH — write a single content scope.
 *
 * Body shape: { scope: "hero" | "about" | "now" | "products" | "blog", value: any }
 *
 * Auth chain:
 *   1. Valid admin session cookie
 *   2. Origin/Referer matches host
 *   3. CSRF cookie/header double-submit
 *   4. Rate limit (shared with other admin endpoints)
 *   5. Schema validation in content.ts before persistence
 */
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    await logAdminAction(req, "content.patch", false, { reason: "unauth" });
    return unauthorized();
  }

  const limited = applyAdminRateLimit(req);
  if (limited) {
    await logAdminAction(req, "content.patch", false, { reason: "rate-limit" });
    return limited;
  }

  if (!isSameOriginWrite(req)) {
    await logAdminAction(req, "content.patch", false, { reason: "bad-origin" });
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }

  if (!verifyCsrf(req)) {
    await logAdminAction(req, "content.patch", false, { reason: "csrf" });
    return NextResponse.json({ error: "CSRF check failed" }, { status: 403 });
  }

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Expected JSON" }, { status: 415 });
  }

  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    await logAdminAction(req, "content.patch", false, { reason: "too-large" });
    return NextResponse.json({ error: "Body too large" }, { status: 413 });
  }

  let body: { scope?: unknown; value?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const scope = body.scope;
  if (typeof scope !== "string" || !VALID_SCOPES.includes(scope as Scope)) {
    return NextResponse.json({ error: "Unknown scope" }, { status: 400 });
  }

  if (!isStorageWritable()) {
    await logAdminAction(req, "content.patch", false, {
      scope,
      reason: "no-storage",
    });
    return NextResponse.json(
      {
        error:
          "Persistent storage is not configured. Provision Vercel KV / Upstash and set KV_REST_API_URL + KV_REST_API_TOKEN.",
      },
      { status: 503 }
    );
  }

  try {
    await setScope(scope as Scope, body.value);
    await logAdminAction(req, "content.patch", true, { scope });
    return NextResponse.json({ success: true, scope });
  } catch (err) {
    await logAdminAction(req, "content.patch", false, {
      scope,
      reason: "exception",
    });
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
