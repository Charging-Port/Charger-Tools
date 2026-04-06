import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("Newsletter signup (no RESEND_API_KEY configured):", email);
      return NextResponse.json({ success: true });
    }

    // When you set up a Resend audience, add the contact there.
    // For now, send a notification email about the signup.
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const contactEmail = process.env.CONTACT_EMAIL || "hello@chargertools.com";

    await resend.emails.send({
      from: "ChargerTools <onboarding@resend.dev>",
      to: contactEmail,
      subject: "New newsletter signup",
      text: `New subscriber: ${email}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
