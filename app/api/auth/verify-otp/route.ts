import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyOtp } from "@/lib/auth/otp";
import { signAccessToken, issueRefreshToken } from "@/lib/auth/jwt";

const schema = z.object({
  identifier: z.string().min(1),
  identifierType: z.enum(["email", "phone"]),
  otp: z.string().length(6),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { identifier, identifierType, otp } = parsed.data;
  const result = await verifyOtp(identifier, otp);
  if (!result.valid) {
    return NextResponse.json({ error: result.message }, { status: 401 });
  }

  await connectDB();

  const query = identifierType === "email" ? { email: identifier } : { phone: identifier };
  let user = await User.findOne(query);
  const isNewUser = !user;

  if (!user) {
    user = await User.create({
      [identifierType]: identifier,
      isVerified: true,
      role: "patient",
      referenceId: identifier,
    });
  } else if (!user.isVerified) {
    user.isVerified = true;
    await user.save();
  }

  // New users must complete profile before getting full JWT
  if (isNewUser || !user.name) {
    const tempToken = signAccessToken({
      userId: user._id.toString(),
      role: "incomplete",
      identifierType,
    });
    return NextResponse.json({ requiresProfile: true, tempToken });
  }

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
    identifierType,
  });
  const refreshToken = await issueRefreshToken(user._id.toString());

  const res = NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    accessToken,
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
