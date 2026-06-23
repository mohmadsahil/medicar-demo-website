import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import RefreshToken from "@/models/RefreshToken";
import { signAccessToken, issueRefreshToken } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  const oldToken = req.cookies.get("refresh_token")?.value;
  if (!oldToken) return NextResponse.json({ error: "No refresh token" }, { status: 401 });

  await connectDB();
  const tokenHash = crypto.createHash("sha256").update(oldToken).digest("hex");
  const record = await RefreshToken.findOne({ tokenHash });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Refresh token expired or invalid" }, { status: 401 });
  }

  const user = await User.findById(record.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

  await record.deleteOne();

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
    identifierType: user.email ? "email" : "phone",
  });
  const newRefresh = await issueRefreshToken(user._id.toString());

  const res = NextResponse.json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, referenceId: user.referenceId ?? null },
  });

  res.cookies.set("refresh_token", newRefresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 86400,
    path: "/",
  });

  return res;
}
