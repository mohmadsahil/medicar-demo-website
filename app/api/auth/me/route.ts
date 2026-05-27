import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { withAuth } from "@/lib/auth/middleware";

export const GET = withAuth(async (_req: NextRequest, user) => {
  await connectDB();
  const dbUser = await User.findById(user.userId).select("-__v").lean();
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ user: dbUser });
});
