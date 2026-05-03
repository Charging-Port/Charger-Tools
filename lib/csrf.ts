import crypto from "crypto";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

/**
 * CSRF protection via the double-submit cookie pattern.
 *
 * On login we mint a random token and drop it as a NON-httpOnly cookie
 * (`ct_admin_csrf`) so the JS on our own pages can read it. Admin write
 * endpoints require that same value to be echoed in the `x-csrf-token`
 * header. An attacker on another origin cannot read our cookie, so they
 * cannot forge the matching header.
 *
 * The session cookie itself remains httpOnly. The CSRF cookie carries no
 * authority on its own — without a valid session it does nothing.
 *
 * We also keep the existing Origin/Referer check as a second line of
 * defense; if either layer fails, the write is rejected.
 */

export const CSRF_COOKIE_NAME = "ct_admin_csrf";
export const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_TOKEN_BYTES = 32;
const CSRF_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function createCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_BYTES).toString("hex");
}

/**
 * Attach a freshly-minted CSRF cookie to the response. Called from the login
 * route after authentication succeeds.
 */
export function setCsrfCookie(res: NextResponse, token: string): void {
  res.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // intentional — JS must read this to echo in header
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CSRF_MAX_AGE_SECONDS,
  });
}

export function clearCsrfCookie(res: NextResponse): void {
  res.cookies.delete(CSRF_COOKIE_NAME);
}

/**
 * Verify the request carries a CSRF cookie that matches the header.
 *
 * Returns true only when both are present, both are non-empty, and they
 * match in constant time. A missing cookie always fails.
 */
export function verifyCsrf(req: NextRequest): boolean {
  const cookieToken = req.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = req.headers.get(CSRF_HEADER_NAME);
  if (!cookieToken || !headerToken) return false;
  if (cookieToken.length !== headerToken.length) return false;
  if (cookieToken.length < 32) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken),
      Buffer.from(headerToken)
    );
  } catch {
    return false;
  }
}

/**
 * Read the CSRF token from server-side cookies — used by the admin dashboard
 * to render an initial value into the page so client code can pick it up
 * even on the very first render.
 */
export function readServerCsrfCookie(): string | null {
  return cookies().get(CSRF_COOKIE_NAME)?.value ?? null;
}
