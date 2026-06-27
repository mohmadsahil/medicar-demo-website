import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import ConsentTransaction from "@/models/ConsentTransaction";
import {
  verifyAccessToken,
  signAccessToken,
  issueRefreshToken,
} from "@/lib/auth/jwt";
import { grantConsent } from "@/lib/consent/manager";

const schema = z.object({
  name: z.string().min(2).max(100),
  dob: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  consentedPurposes: z.array(z.string()).min(1, "At least one consent required"),
  language: z.enum(["en", "hi"]).default("en"),
  transactionId: z.string().min(1, "Consent transaction ID is required"),
});

async function verifyConsentTransaction(
  transactionId: string,
  referenceId: string,
  refrenceInfo: { email?: string; name?: string; phone?: string },
): Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }> {
  const apiKey = process.env.DIGITAL_ANUMATI_API_KEY;
  if (!apiKey) return { success: false, error: "Consent API key not configured" };

  const verifyUrl = `${process.env.DIGITAL_ANUMATI_BASE_URL ?? "http://localhost:5001"}/api/v1/server/transaction/verify`;

  try {
    const res = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": apiKey,
      },
      body: JSON.stringify({
        transactionId,
        referenceId,
        refrenceInfo: {
          email: refrenceInfo.email ?? "",
          name:  refrenceInfo.name  ?? "",
          phone: refrenceInfo.phone ?? "",
        },
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data?.message ?? `Verification failed (${res.status})` };
    }
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Consent verification request failed" };
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = verifyAccessToken(authHeader.slice(7));
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  if (payload.role !== "incomplete") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectDB();
  const { name, dob, gender, consentedPurposes, language, transactionId } = parsed.data;

  const existingUser = await User.findById(payload.userId);
  if (!existingUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Generate unique DA-REF referenceId for this user (or reuse if already assigned)
  const referenceId =
    existingUser.referenceId?.startsWith("DA-REF-")
      ? existingUser.referenceId
      : `DA-REF-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  // Verify consent transaction with Anumati
  const verification = await verifyConsentTransaction(
    transactionId,
    referenceId,
    {
      email: existingUser.email ?? "",
      name:  existingUser.name  ?? "",
      phone: existingUser.phone ? `+91${existingUser.phone.replace(/^\+91/, "")}` : "",
    },
  );
  console.log("Consent verification result:", verification);

  if (!verification.success) {
    return NextResponse.json(
      { error: "Invalid or unverified consent transaction. Please complete the consent form and try again." },
      { status: 422 },
    );
  }

  const verifyData = verification.data ?? {};

  // Extract purposes from verify response (fallback to submitted list)
  const verifiedPurposes: string[] =
    Array.isArray((verifyData as Record<string, unknown>).purposes)
      ? ((verifyData as Record<string, unknown>).purposes as string[])
      : consentedPurposes;

  // Update user profile
  const user = await User.findByIdAndUpdate(
    payload.userId,
    { name, dob: dob ? new Date(dob) : undefined, gender, isVerified: true, referenceId },
    { new: true },
  );
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Save verified consent transaction
  await ConsentTransaction.create({
    transactionId,
    referenceId,
    userId: user._id,
    email: user.email,
    mobile: user.phone,
    verifiedAt: new Date(),
    purposes: verifiedPurposes,
    transactionDetail: verifyData,
  });

  // Grant consents locally using verified purposes
  const ip = req.headers.get("x-forwarded-for") ?? undefined;
  const ua = req.headers.get("user-agent") ?? undefined;
  const consentReceipts: string[] = [];

  for (const purposeId of verifiedPurposes) {
    try {
      const { consentReceiptId } = await grantConsent(user._id.toString(), purposeId, {
        ipAddress: ip,
        userAgent: ua,
        language,
      });
      consentReceipts.push(consentReceiptId);
    } catch (e) {
      console.error(`Consent grant failed for ${purposeId}:`, e);
    }
  }

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
    identifierType: payload.identifierType,
  });
  const refreshToken = await issueRefreshToken(user._id.toString());

  const res = NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, referenceId: user.referenceId ?? null },
    accessToken,
    consentReceipts,
    referenceId,
    transaction: {
      transactionId,
      verifiedAt: new Date(),
      purposes: verifiedPurposes,
    },
  });

  res.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 86400,
    path: "/",
  });

  return res;
}
