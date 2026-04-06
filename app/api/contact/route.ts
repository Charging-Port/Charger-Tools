import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, company } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL || "hello@chargertools.com";

    if (!apiKey) {
      // Dev fallback: log to console if no API key
      console.log("Contact form submission (no RESEND_API_KEY configured):", {
        name,
        email,
        company,
        message,
      });
      return NextResponse.json({ success: true });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "ChargerTools <onboarding@resend.dev>",
      to: contactEmail,
      replyTo: email,
      subject: `Contact: ${name}${company ? ` (${company})` : ""}`,
      text: `Name: ${name}\nEmail: ${email}${company ? `\nCompany: ${company}` : ""}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
