import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const EMAIL_MAX_LENGTH = 254; // RFC 5321
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

function err(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  // ── Rate limiting: 3 signups per IP per hour ─────────────────────────────
  const ip = getClientIp(req);
  const rl = checkRateLimit(`newsletter:${ip}`, {
    limit: 3,
    windowMs: 60 * 60 * 1000,
  });

  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  // ── Content-Type guard ───────────────────────────────────────────────────
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return err("Content-Type must be application/json", 415);
  }

  // ── Parse body ───────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body", 400);
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return err("Invalid request body", 400);
  }

  const { email: rawEmail } = body as Record<string, unknown>;

  if (typeof rawEmail !== "string") {
    return err("Email is required", 400);
  }

  const email = rawEmail.trim();

  if (!email) {
    return err("Email is required", 400);
  }
  if (email.length > EMAIL_MAX_LENGTH) {
    return err("Invalid email address", 400);
  }
  if (!EMAIL_RE.test(email)) {
    return err("Invalid email address", 400);
  }

  // ── Send notification ────────────────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[newsletter] Signup received (RESEND_API_KEY not set):", {
      emailLength: email.length,
    });
    return NextResponse.json({ success: true });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const contactEmail = process.env.CONTACT_EMAIL || "hello@chargertools.com";
    const fromAddress =
      process.env.CONTACT_FROM || "ChargerTools <onboarding@resend.dev>";

    // Resend SDK returns { data, error } on API rejection — must inspect.
    const result = await resend.emails.send({
      from: fromAddress,
      to: contactEmail,
      subject: "New newsletter signup",
      text: `New subscriber: ${email}`,
    });

    if (result.error) {
      console.error(
        "[newsletter] Resend API rejected send:",
        result.error.name,
        result.error.message
      );
      return err("Failed to subscribe. Please try again.", 502);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[newsletter] Email send failed:", error instanceof Error ? error.message : "unknown");
    return err("Failed to subscribe. Please try again.", 500);
  }
}
