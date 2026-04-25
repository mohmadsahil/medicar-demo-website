import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, COOKIE_NAME_EXPORT } from "@/lib/auth";
import { verifyDigitalAnumatiConsent } from "@/lib/digitalAnumati";
import { sendConsentRevokeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, consentId } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    let revokeUrl: string | undefined;
    let consentUserId: string | undefined;
    let consentRecordId: string | undefined;
    let referenceId: string | undefined;

    if (consentId?.trim()) {
      try {
        referenceId = `${crypto.randomUUID()}${Date.now()}`;
        const consentResponse = await verifyDigitalAnumatiConsent(
          consentId.trim(),
          referenceId,
          email.toLowerCase(),
        );
        console.log("[register] verifyDigitalAnumatiConsent", consentResponse);
        revokeUrl = consentResponse?.data?.revokeUrl;
        consentUserId = consentResponse?.data?.userId;
        consentRecordId = consentResponse?.data?.consentRecordId;
      } catch (err) {
        console.error("[register] consent verify failed (non-blocking):", err);
      }
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashed,
      consentId: consentId?.trim(),
      consentUserId,
      consentRecordId,
      referenceId,
      revokeUrl,
    });

    if (revokeUrl) {
      Promise.resolve()
        .then(() =>
          sendConsentRevokeEmail(
            { name: name.trim(), email: email.toLowerCase() },
            revokeUrl!,
          ),
        )
        .catch((err) =>
          console.error("[register] revoke email failed:", err?.message ?? err),
        );
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          referenceId: user.referenceId,
        },
      },
      { status: 201 },
    );

    response.cookies.set(COOKIE_NAME_EXPORT, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
