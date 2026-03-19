import { NextResponse } from "next/server";
import { Resend } from "resend";

import { getCvData } from "@/lib/cv";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const { cv } = getCvData();
    const recipientEmail = process.env.CONTACT_EMAIL ?? cv.email;
    if (!recipientEmail) {
      return NextResponse.json(
        { error: "Recipient email is not configured" },
        { status: 500 }
      );
    }

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [recipientEmail],
      replyTo: email.trim(),
      subject: subject?.trim() ? `[Portfolio] ${subject.trim()}` : `[Portfolio] Message from ${name.trim()}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(name.trim())} &lt;${escapeHtml(email.trim())}&gt;</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject?.trim() || "(no subject)")}</p>
        <hr />
        <pre style="font-family: inherit; white-space: pre-wrap;">${escapeHtml(message.trim())}</pre>
      `,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message ?? "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
