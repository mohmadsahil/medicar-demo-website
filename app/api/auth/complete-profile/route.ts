import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import {
  verifyAccessToken,
  signAccessToken,
  issueRefreshToken,
} from "@/lib/auth/jwt";
import { grantConsent } from "@/lib/consent/manager";
import { sendWelcomeEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2).max(100),
  dob: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  consentedPurposes: z
    .array(z.string())
    .min(1, "At least one consent required"),
  language: z.enum(["en", "hi"]).default("en"),
});

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

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await connectDB();
  const { name, dob, gender, consentedPurposes, language } = parsed.data;

  const existingUser = await User.findById(payload.userId);
  if (!existingUser)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const referenceId =
    existingUser.referenceId || existingUser.email || existingUser.phone;

  const user = await User.findByIdAndUpdate(
    payload.userId,
    {
      name,
      dob: dob ? new Date(dob) : undefined,
      gender,
      isVerified: true,
      ...(referenceId && !existingUser.referenceId ? { referenceId } : {}),
    },
    { new: true },
  );

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? undefined;
  const ua = req.headers.get("user-agent") ?? undefined;
  const consentReceipts: string[] = [];

  for (const purposeId of consentedPurposes) {
    try {
      const { consentReceiptId } = await grantConsent(
        user._id.toString(),
        purposeId,
        {
          ipAddress: ip,
          userAgent: ua,
          language,
        },
      );
      consentReceipts.push(consentReceiptId);
    } catch (e) {
      console.error(`Consent grant failed for ${purposeId}:`, e);
    }
  }

  // Send welcome email with granted purposes
  if (user.email) {
    sendWelcomeEmail({
      name: user.name,
      email: user.email,
      grantedPurposes: consentedPurposes,
    }).catch(console.error);
  }

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
    identifierType: payload.identifierType,
  });
  const refreshToken = await issueRefreshToken(user._id.toString());

  const res = NextResponse.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    accessToken,
    consentReceipts,
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
