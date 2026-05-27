import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import RefreshToken from "@/models/RefreshToken";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("refresh_token")?.value;

  if (token) {
    await connectDB();
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    await RefreshToken.deleteOne({ tokenHash: hash });
  }

  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.delete("refresh_token");
  return res;
}
