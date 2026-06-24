import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import ConsentRecord from "@/models/ConsentRecord";
import ConsentWebhookEvent from "@/models/ConsentWebhookEvent";
import ConsentTransaction from "@/models/ConsentTransaction";
import Appointment from "@/models/Appointment";

export async function GET() {
  await connectDB();

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [
    totalUsers, verifiedUsers,
    granted, withdrawn, expired,
    totalWebhooks, webhooks24h,
    totalTransactions,
    totalAppointments,
    recentWebhooks,
    recentTransactions,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ isVerified: true }),
    ConsentRecord.countDocuments({ status: "granted" }),
    ConsentRecord.countDocuments({ status: "withdrawn" }),
    ConsentRecord.countDocuments({ status: "expired" }),
    ConsentWebhookEvent.countDocuments({}),
    ConsentWebhookEvent.countDocuments({ createdAt: { $gte: since24h } }),
    ConsentTransaction.countDocuments({}),
    Appointment.countDocuments({}),
    ConsentWebhookEvent.find({}).sort({ createdAt: -1 }).limit(50).lean(),
    ConsentTransaction.find({}).sort({ createdAt: -1 }).limit(50).lean(),
    User.find({}).sort({ createdAt: -1 }).limit(50).select("-__v").lean(),
  ]);

  return NextResponse.json({
    stats: {
      users: { total: totalUsers, verified: verifiedUsers },
      consents: { granted, withdrawn, expired, total: granted + withdrawn + expired },
      webhooks: { total: totalWebhooks, last24h: webhooks24h },
      transactions: { total: totalTransactions },
      appointments: { total: totalAppointments },
    },
    recentWebhooks,
    recentTransactions,
    recentUsers,
  });
}
