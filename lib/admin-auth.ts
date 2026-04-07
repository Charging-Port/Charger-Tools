import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Stateless cookie-based auth for the admin panel.
 *
 * - ADMIN_PASSWORD env var: the plaintext password the user enters on /admin/login
 * - ADMIN_SECRET env var:   secret used to HMAC-sign the session cookie
 *
 * The cookie value is HMAC(ADMIN_SECRET, "admin"). On every protected request
 * we recompute the HMAC and constant-time compare. No server-side session store
 * is needed — sessions survive restarts and work across multiple instances.
 *
 * Limitations: there is no rotation, expiry, or revocation. If the secret leaks
 * the cookie is forever valid until the secret changes. For a personal site
 * with one user this is acceptable; for anything more, swap to next-auth.
 */

export const ADMIN_COOKIE_NAME = "ct_admin_session";

const DEV_DEFAULT_PASSWORD = "changeme";
const DEV_DEFAULT_SECRET = "dev-only-change-me-in-production";

function getPassword(): string {
  return process.env.ADMIN_PASSWORD || DEV_DEFAULT_PASSWORD;
}

function getSecret(): string {
  return process.env.ADMIN_SECRET || DEV_DEFAULT_SECRET;
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
  return constantTimeEqual(input, getPassword());
}

/** Generate the session token for an authenticated admin. */
export function createSessionToken(): string {
  return crypto.createHmac("sha256", getSecret()).update("admin").digest("hex");
}

/** Validate a session token from a cookie. */
export function isValidSession(token: string | undefined | null): boolean {
  if (!token) return false;
  const expected = createSessionToken();
  return constantTimeEqual(token, expected);
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
