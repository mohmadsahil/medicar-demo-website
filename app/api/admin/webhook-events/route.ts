import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ConsentWebhookEvent from "@/models/ConsentWebhookEvent";
import { withAuth } from "@/lib/auth/middleware";

export const GET = withAuth(async (req: NextRequest) => {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 200);

  const events = await ConsentWebhookEvent.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({ events });
}, { roles: ["admin"] });
