import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Stateless cookie-based auth for the admin panel.
 *
 * - ADMIN_PASSWORD env var: the plaintext password the user enters on /admin/login
 * - ADMIN_SECRET env var:   secret used to HMAC-sign the session cookie
 *
 * The cookie value is HMAC(ADMIN_SECRET, "admin:<issuedAt>") plus the issuedAt
 * timestamp. On every protected request we recompute the HMAC, constant-time
 * compare, and check the issuedAt is within MAX_SESSION_AGE_MS. No server-side
 * session store is needed — sessions survive restarts and work across multiple
 * instances.
 *
 * Behaviour by environment:
 *  - In production: if ADMIN_PASSWORD or ADMIN_SECRET is missing, every auth
 *    check fails. Login cannot succeed; protected pages redirect to /login.
 *    This is a fail-closed posture — no silent default credentials.
 *  - In development: dev defaults are used so the admin panel is usable
 *    out-of-the-box, but a console warning is emitted.
 */

export const ADMIN_COOKIE_NAME = "ct_admin_session";

const MAX_SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const DEV_DEFAULT_PASSWORD = "changeme";
const DEV_DEFAULT_SECRET = "dev-only-change-me-in-production";

let warnedMissingSecrets = false;

/**
 * Resolve the admin password and secret. Returns null in production when
 * either is missing — callers must treat null as "auth disabled".
 */
function getCredentials(): { password: string; secret: string } | null {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;

  if (password && secret) {
    return { password, secret };
  }

  // Fail closed in production — never use baked-in defaults there.
  if (process.env.NODE_ENV === "production") {
    if (!warnedMissingSecrets) {
      // eslint-disable-next-line no-console
      console.error(
        "[admin-auth] ADMIN_PASSWORD and/or ADMIN_SECRET are not set. Admin access is disabled."
      );
      warnedMissingSecrets = true;
    }
    return null;
  }

  if (!warnedMissingSecrets) {
    // eslint-disable-next-line no-console
    console.warn(
      "[admin-auth] Using development default password/secret. Set ADMIN_PASSWORD and ADMIN_SECRET in .env.local."
    );
    warnedMissingSecrets = true;
  }

  return {
    password: password || DEV_DEFAULT_PASSWORD,
    secret: secret || DEV_DEFAULT_SECRET,
  };
}

/** Constant-time string comparison to avoid timing attacks. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  return crypto.timingSafeEqual(aBuf, bBuf);
}

/** Verify a plaintext password against the configured ADMIN_PASSWORD. */
export function verifyPassword(input: string): boolean {
  const creds = getCredentials();
  if (!creds) return false;
  // Inputs may have wildly different lengths; constantTimeEqual exits fast on
  // mismatched length, which leaks length only — not the password itself.
  if (typeof input !== "string") return false;
  // Pad both to a fixed buffer to avoid leaking length via comparison time.
  const inputHash = crypto.createHash("sha256").update(input).digest();
  const expectedHash = crypto.createHash("sha256").update(creds.password).digest();
  return crypto.timingSafeEqual(inputHash, expectedHash);
}

/**
 * Generate a session token tied to the issue time. Tokens look like:
 *   <issuedAtMs>.<hex hmac>
 * The HMAC binds the issuedAt to the secret, so neither can be modified
 * without invalidating the token.
 */
export function createSessionToken(): string {
  const creds = getCredentials();
  if (!creds) {
    throw new Error("Cannot create session: admin auth not configured");
  }
  const issuedAt = Date.now();
  const mac = crypto
    .createHmac("sha256", creds.secret)
    .update(`admin:${issuedAt}`)
    .digest("hex");
  return `${issuedAt}.${mac}`;
}

/** Validate a session token from a cookie. */
export function isValidSession(token: string | undefined | null): boolean {
  if (!token || typeof token !== "string") return false;
  const creds = getCredentials();
  if (!creds) return false;

  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return false;

  const issuedAtStr = token.slice(0, dot);
  const presentedMac = token.slice(dot + 1);

  // Hex check on the MAC half — anything else is a junk value.
  if (!/^[0-9a-f]+$/.test(presentedMac)) return false;

  const issuedAt = Number(issuedAtStr);
  if (!Number.isFinite(issuedAt) || issuedAt <= 0) return false;

  // Reject tokens older than MAX_SESSION_AGE_MS — even if the HMAC is valid.
  if (Date.now() - issuedAt > MAX_SESSION_AGE_MS) return false;
  // Tokens issued in the future (clock skew or tampering) are also rejected.
  if (issuedAt - Date.now() > 60_000) return false;

  const expectedMac = crypto
    .createHmac("sha256", creds.secret)
    .update(`admin:${issuedAt}`)
    .digest("hex");

  if (presentedMac.length !== expectedMac.length) return false;
  return constantTimeEqual(presentedMac, expectedMac);
}

/** Read the cookie and check whether the request is authenticated. */
export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return isValidSession(session?.value);
}

/**
 * Use this at the top of any admin server component. Redirects to /admin/login
 * if the request is not authenticated. Throws (technically `redirect()` does)
 * so the rest of the component does not run.
 */
export function requireAuth(): void {
  if (!isAuthenticated()) {
    redirect("/admin/login");
  }
}

/** Maximum age of a session cookie, in seconds — used by the cookie's maxAge. */
export const SESSION_MAX_AGE_SECONDS = MAX_SESSION_AGE_MS / 1000;
