import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import ConsentRecord from "@/models/ConsentRecord";
import ConsentAuditLog from "@/models/ConsentAuditLog";
import ConsentPurpose from "@/models/ConsentPurpose";

// Section 6 – Consent must be free, specific, informed, unambiguous, and withdrawable
export async function grantConsent(
  userId: string,
  purposeId: string,
  options: { ipAddress?: string; userAgent?: string; language?: "en" | "hi"; noticeId?: string } = {}
): Promise<{ success: boolean; consentReceiptId: string }> {
  await connectDB();

  const purpose = await ConsentPurpose.findOne({ purposeId, isActive: true });
  if (!purpose) throw new Error(`Consent purpose '${purposeId}' not found`);

  const consentReceiptId = `CR-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
  // Section 7 – Retention aligned to purpose
  const expiresAt = new Date(Date.now() + 365 * 86400 * 1000);

  await ConsentRecord.findOneAndUpdate(
    { userId, purposeId },
    {
      userId,
      purposeId,
      status: "granted",
      grantedAt: new Date(),
      expiresAt,
      consentReceiptId,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      version: purpose.version,
      language: options.language ?? "en",
      collectionMethod: "web_form",
      noticeId: options.noticeId,
    },
    { upsert: true, new: true }
  );

  await ConsentAuditLog.create({
    userId,
    action: "consent.granted",
    purposeId,
    consentReceiptId,
    metadata: { purposeName: purpose.name, version: purpose.version },
    ipAddress: options.ipAddress,
    userAgent: options.userAgent,
    performedBy: "user",
  });

  return { success: true, consentReceiptId };
}

// Section 6(4) – Right to withdraw consent at any time
export async function withdrawConsent(
  userId: string,
  purposeId: string,
  options: { ipAddress?: string; userAgent?: string } = {}
): Promise<{ success: boolean }> {
  await connectDB();

  const record = await ConsentRecord.findOneAndUpdate(
    { userId, purposeId, status: "granted" },
    { status: "withdrawn", withdrawnAt: new Date() },
    { new: true }
  );

  if (!record) throw new Error("No active consent found for this purpose");

  await ConsentAuditLog.create({
    userId,
    action: "consent.withdrawn",
    purposeId,
    consentReceiptId: record.consentReceiptId,
    metadata: {},
    ipAddress: options.ipAddress,
    userAgent: options.userAgent,
    performedBy: "user",
  });

  return { success: true };
}

export async function getUserConsents(userId: string) {
  await connectDB();
  const [records, purposes] = await Promise.all([
    ConsentRecord.find({ userId }).lean(),
    ConsentPurpose.find({ isActive: true }).lean(),
  ]);

  return purposes.map((p) => ({
    ...p,
    consentRecord: records.find((r) => r.purposeId === p.purposeId) ?? null,
  }));
}

export async function getConsentHistory(userId: string, limit = 50) {
  await connectDB();
  return ConsentAuditLog.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}
