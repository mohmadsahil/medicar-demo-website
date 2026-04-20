import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { verifyDigitalAnumatiConsent } from "@/lib/digitalAnumati";
import { sendConsentRevokeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, consentId } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (message.trim().length < 10) {
      return NextResponse.json({ error: "Message must be at least 10 characters." }, { status: 400 });
    }

    let revokeUrl: string | undefined;
    let consentUserId: string | undefined;
    let consentRecordId: string | undefined;
    let referenceId: string | undefined;

    if (consentId?.trim()) {
      try {
        referenceId = `${crypto.randomUUID()}${Date.now()}`;
        const consentResponse = await verifyDigitalAnumatiConsent(consentId.trim(), referenceId, email.toLowerCase());
        console.log("[contact] verifyDigitalAnumatiConsent", consentResponse);
        revokeUrl = consentResponse?.data?.revokeUrl;
        consentUserId = consentResponse?.data?.userId;
        consentRecordId = consentResponse?.data?.consentRecordId;
      } catch (err) {
        console.error("[contact] consent verify failed (non-blocking):", err);
      }
    }

    await connectDB();
    await Contact.create({
      name: name.trim(),
      email: email.toLowerCase(),
      message: message.trim(),
      consentId: consentId?.trim(),
      consentUserId,
      consentRecordId,
      referenceId,
      revokeUrl,
    });

    if (revokeUrl) {
      Promise.resolve()
        .then(() => sendConsentRevokeEmail({ name: name.trim(), email: email.toLowerCase() }, revokeUrl!))
        .catch((err) => console.error("[contact] revoke email failed:", err?.message ?? err));
    }

    return NextResponse.json({ message: "Message received. We will get back to you within 24 hours." }, { status: 201 });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
