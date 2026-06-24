import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ConsentWebhookEvent from "@/models/ConsentWebhookEvent";
import ConsentTransaction from "@/models/ConsentTransaction";
import ConsentRecord from "@/models/ConsentRecord";
import ConsentAuditLog from "@/models/ConsentAuditLog";
import User from "@/models/User";

export async function DELETE() {
  await connectDB();

  const [webhooks, transactions, records, auditLogs, users] = await Promise.all([
    ConsentWebhookEvent.deleteMany({}),
    ConsentTransaction.deleteMany({}),
    ConsentRecord.deleteMany({}),
    ConsentAuditLog.deleteMany({}),
    User.deleteMany({ role: { $ne: "admin" } }), // keep admin accounts
  ]);

  return NextResponse.json({
    deleted: {
      webhookEvents: webhooks.deletedCount,
      transactions: transactions.deletedCount,
      consentRecords: records.deletedCount,
      auditLogs: auditLogs.deletedCount,
      users: users.deletedCount,
    },
  });
}
