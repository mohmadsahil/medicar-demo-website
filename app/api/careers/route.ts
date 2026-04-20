import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import { verifyDigitalAnumatiConsent } from "@/lib/digitalAnumati";
import { sendConsentRevokeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, position, resumeName, message, consentId } = body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !position?.trim() || !resumeName?.trim()) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    let revokeUrl: string | undefined;
    let consentUserId: string | undefined;
    let consentRecordId: string | undefined;

    if (consentId?.trim()) {
      try {
        const referenceId = `${crypto.randomUUID()}${Date.now()}`;
        const consentResponse = await verifyDigitalAnumatiConsent(consentId.trim(), referenceId, email.toLowerCase());
        console.log("[careers] verifyDigitalAnumatiConsent", consentResponse);
        revokeUrl = consentResponse?.data?.revokeUrl;
        consentUserId = consentResponse?.data?.userId;
        consentRecordId = consentResponse?.data?.consentRecordId;
      } catch (err) {
        console.error("[careers] consent verify failed (non-blocking):", err);
      }
    }

    await connectDB();
    await Application.create({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      position: position.trim(),
      resumeName: resumeName.trim(),
      message: message?.trim() || "",
      consentId: consentId.trim(),
      consentUserId,
      consentRecordId,
      revokeUrl,
    });

    if (revokeUrl) {
      Promise.resolve()
        .then(() => sendConsentRevokeEmail({ name: name.trim(), email: email.toLowerCase() }, revokeUrl!))
        .catch((err) => console.error("[careers] revoke email failed:", err?.message ?? err));
    }

    return NextResponse.json({ message: "Application submitted. We will be in touch within 3 business days." }, { status: 201 });
  } catch (err) {
    console.error("[careers]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
