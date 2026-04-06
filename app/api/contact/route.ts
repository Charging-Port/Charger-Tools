import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Field length limits — prevents payload bloat / log flooding
const LIMITS = {
  name: 100,
  email: 254, // RFC 5321 max
  company: 150,
  message: 5000,
} as const;

// Strict email regex (not a substitute for deliverability checks, but catches obvious junk)
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

/** Generic error returned to callers — never exposes internal details */
function err(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  // ── Rate limiting: 5 submissions per IP per 15 minutes ──────────────────
  const ip = getClientIp(req);
  const rl = checkRateLimit(`contact:${ip}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before submitting again." },
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

  const raw = body as Record<string, unknown>;

  // ── Type checks ──────────────────────────────────────────────────────────
  const name = raw.name;
  const email = raw.email;
  const company = raw.company;
  const message = raw.message;

  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return err("Name, email, and message are required", 400);
  }
  if (company !== undefined && typeof company !== "string") {
    return err("Invalid company field", 400);
  }

  // ── Presence checks ──────────────────────────────────────────────────────
  const nameTrimmed = name.trim();
  const emailTrimmed = email.trim();
  const companyTrimmed = typeof company === "string" ? company.trim() : "";
  const messageTrimmed = message.trim();

  if (!nameTrimmed || !emailTrimmed || !messageTrimmed) {
    return err("Name, email, and message are required", 400);
  }

  // ── Length limits ────────────────────────────────────────────────────────
  if (nameTrimmed.length > LIMITS.name) {
    return err(`Name must be ${LIMITS.name} characters or fewer`, 400);
  }
  if (emailTrimmed.length > LIMITS.email) {
    return err("Invalid email address", 400);
  }
  if (companyTrimmed.length > LIMITS.company) {
    return err(`Company name must be ${LIMITS.company} characters or fewer`, 400);
  }
  if (messageTrimmed.length > LIMITS.message) {
    return err(`Message must be ${LIMITS.message} characters or fewer`, 400);
  }

  // ── Format validation ────────────────────────────────────────────────────
  if (!EMAIL_RE.test(emailTrimmed)) {
    return err("Invalid email address", 400);
  }

  // ── Send email ───────────────────────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL || "hello@chargertools.com";

  if (!apiKey) {
    // Dev-only fallback: log sanitized fields (no raw user content in structured logs)
    console.log("[contact] Submission received (RESEND_API_KEY not set):", {
      name: nameTrimmed,
      email: emailTrimmed,
      hasCompany: Boolean(companyTrimmed),
      messageLength: messageTrimmed.length,
    });
    return NextResponse.json({ success: true });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "ChargerTools <onboarding@resend.dev>",
      to: contactEmail,
      replyTo: emailTrimmed,
      subject: `Contact: ${nameTrimmed}${companyTrimmed ? ` (${companyTrimmed})` : ""}`,
      // Plain text only — no HTML injection surface
      text: [
        `Name: ${nameTrimmed}`,
        `Email: ${emailTrimmed}`,
        companyTrimmed ? `Company: ${companyTrimmed}` : null,
        "",
        "Message:",
        messageTrimmed,
      ]
        .filter((l) => l !== null)
        .join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Log internally but never expose provider error details to clients
    console.error("[contact] Email send failed:", error instanceof Error ? error.message : "unknown");
    return err("Failed to send message. Please try again.", 500);
  }
}
