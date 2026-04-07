import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  verifyPassword,
} from "@/lib/admin-auth";

/**
 * Login endpoint. Accepts both JSON (`fetch` from the client) and
 * `application/x-www-form-urlencoded` / `multipart/form-data` (native HTML
 * form fallback). The form fallback exists so login works even if React
 * fails to hydrate on the client for any reason.
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

  if (!verifyPassword(password)) {
    // Sleep ~250ms on bad password to discourage brute-force a tiny bit
    await new Promise((r) => setTimeout(r, 250));
    return errorResponse(req, isForm, "Incorrect password", 401);
  }

  const token = createSessionToken();

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
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
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
