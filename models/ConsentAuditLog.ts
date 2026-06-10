import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConsentAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  purposeId?: string;
  consentReceiptId?: string;
  metadata: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  performedBy: "user" | "system" | "admin";
  createdAt: Date;
}

const ConsentAuditLogSchema = new Schema<IConsentAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    purposeId: { type: String },
    consentReceiptId: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String },
    userAgent: { type: String },
    performedBy: { type: String, enum: ["user", "system", "admin"], default: "user" },
  },
  { timestamps: true }
);

ConsentAuditLogSchema.index({ userId: 1, createdAt: -1 });

const ConsentAuditLog: Model<IConsentAuditLog> =
  mongoose.models.ConsentAuditLog ??
  mongoose.model<IConsentAuditLog>("ConsentAuditLog", ConsentAuditLogSchema);
export default ConsentAuditLog;
