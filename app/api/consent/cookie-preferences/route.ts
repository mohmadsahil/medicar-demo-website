import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import CookiePreference from "@/models/CookiePreference";
import { withAuth } from "@/lib/auth/middleware";

const schema = z.object({
  analytics: z.boolean().default(false),
  marketing: z.boolean().default(false),
  functional: z.boolean().default(false),
});

export const POST = withAuth(async (req: NextRequest, user) => {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  await CookiePreference.findOneAndUpdate(
    { userId: user.userId },
    { userId: user.userId, necessary: true, ...parsed.data },
    { upsert: true }
  );

  return NextResponse.json({ message: "Cookie preferences saved" });
});
