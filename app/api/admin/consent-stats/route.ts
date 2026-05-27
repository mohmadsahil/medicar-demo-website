import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ConsentRecord from "@/models/ConsentRecord";
import ConsentWebhookEvent from "@/models/ConsentWebhookEvent";
import { withAuth } from "@/lib/auth/middleware";

export const GET = withAuth(async (_req: NextRequest) => {
  await connectDB();

  const [granted, withdrawn, expired, totalWebhookEvents, emailsSent] = await Promise.all([
    ConsentRecord.countDocuments({ status: "granted" }),
    ConsentRecord.countDocuments({ status: "withdrawn" }),
    ConsentRecord.countDocuments({ status: "expired" }),
    ConsentWebhookEvent.countDocuments({}),
    ConsentWebhookEvent.countDocuments({ emailSent: true }),
  ]);

  return NextResponse.json({
    stats: {
      totalConsents: granted + withdrawn + expired,
      granted,
      withdrawn,
      expired,
      totalWebhookEvents,
      emailsSent,
    },
  });
}, { roles: ["admin"] });
