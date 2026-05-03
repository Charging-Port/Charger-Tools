import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifyPassword,
} from "@/lib/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createCsrfToken, setCsrfCookie } from "@/lib/csrf";
import { logAdminAction } from "@/lib/audit";

export const dynamic = "force-dynamic";

const MAX_PASSWORD_LENGTH = 256;

/**
 * Login endpoint. Accepts both JSON (`fetch` from the client) and
 * `application/x-www-form-urlencoded` / `multipart/form-data` (native HTML
 * form fallback). The form fallback exists so login works even if React
 * fails to hydrate on the client for any reason.
 *
 * Hardenings beyond the basic flow:
 *  - Rate limit: 10 login attempts per IP per 10 minutes.
 *  - Origin/Referer check: rejects cross-site form submissions (login CSRF).
 *  - Password length cap: prevents pathological inputs.
 *
 * On success:
 *  - JSON requests get { success: true } back, no redirect (the client navigates).
 *  - Form requests get a 303 redirect to /admin so the user lands somewhere.
 */
export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  const isForm =
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data");
  const isJson = contentType.includes("application/json");

  // Reject any other Content-Type — no surprise content negotiation.
  if (!isForm && !isJson) {
    return errorResponse(req, false, "Unsupported Content-Type", 415);
  }

  // ── Origin / Referer check ───────────────────────────────────────────────
  // Browsers always include Origin on POST in modern UA's; reject anything
  // that doesn't come from our own origin. This blocks login CSRF.
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");
  if (!isSameOriginRequest({ origin, referer, host })) {
    return errorResponse(req, isForm, "Invalid request origin", 403);
  }

  // ── Rate limit on the IP ─────────────────────────────────────────────────
  const ip = getClientIp(req);
  const rl = checkRateLimit(`admin-login:${ip}`, {
    limit: 10,
    windowMs: 10 * 60 * 1000,
  });
  if (!rl.allowed) {
    const retryAfter = Math.ceil((rl.resetAt - Date.now()) / 1000);
    if (isForm) {
      return errorResponse(req, true, "Too many attempts. Try later.", 429);
    }
    return NextResponse.json(
      { error: "Too many attempts. Please wait and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  let password: string | null = null;

  try {
    if (isForm) {
      const formData = await req.formData();
      const value = formData.get("password");
      if (typeof value === "string") password = value;
    } else {
      const body = await req.json();
      if (body && typeof body.password === "string") password = body.password;
    }
  } catch {
    return errorResponse(req, isForm, "Invalid request", 400);
  }

  if (!password) {
    return errorResponse(req, isForm, "Password is required", 400);
  }

  // Reject suspiciously long passwords up front — protects against
  // DoS-style memory blow-ups in the hashing step.
  if (password.length > MAX_PASSWORD_LENGTH) {
    await new Promise((r) => setTimeout(r, 250));
    return errorResponse(req, isForm, "Incorrect password", 401);
  }

  if (!verifyPassword(password)) {
    // Sleep ~250ms on bad password to discourage brute-force a tiny bit
    await new Promise((r) => setTimeout(r, 250));
    await logAdminAction(req, "login", false, { reason: "bad-password" });
    return errorResponse(req, isForm, "Incorrect password", 401);
  }

  let token: string;
  try {
    token = createSessionToken();
  } catch {
    // Hits when ADMIN_PASSWORD/ADMIN_SECRET are missing in prod.
    return errorResponse(req, isForm, "Admin auth is not configured", 503);
  }

  // Form submissions: redirect to /admin (303 = always GET, regardless of original method)
  // JSON requests: return success and let the client navigate via router.push
  const res = isForm
    ? NextResponse.redirect(new URL("/admin", req.url), { status: 303 })
    : NextResponse.json({ success: true });

  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  // Mint a fresh CSRF token, dropped as a non-httpOnly cookie so the JS on
  // our admin pages can echo it in the x-csrf-token header on writes.
  setCsrfCookie(res, createCsrfToken());

  await logAdminAction(req, "login", true);

  return res;
}

/**
 * True if the Origin or Referer matches our own host (best-effort).
 * Modern browsers always include Origin on POST, so absence is suspicious.
 */
function isSameOriginRequest(args: {
  origin: string | null;
  referer: string | null;
  host: string | null;
}): boolean {
  const { origin, referer, host } = args;
  if (!host) return false;

  if (origin) {
    try {
      const u = new URL(origin);
      return u.host === host;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const u = new URL(referer);
      return u.host === host;
    } catch {
      return false;
    }
  }

  // No Origin and no Referer — refuse.
  return false;
}

function errorResponse(
  req: NextRequest,
  isForm: boolean,
  message: string,
  status: number
) {
  if (isForm) {
    // Redirect back to the login page with the error in the URL.
    // NextResponse.redirect requires an absolute URL, so we build one from
    // the current request's origin.
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("error", message);
    return NextResponse.redirect(url, { status: 303 });
  }
  return NextResponse.json({ error: message }, { status });
}
