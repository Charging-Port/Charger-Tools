import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { clearCsrfCookie } from "@/lib/csrf";
import { logAdminAction } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(ADMIN_COOKIE_NAME);
  clearCsrfCookie(res);
  await logAdminAction(req, "logout", true);
  return res;
}
