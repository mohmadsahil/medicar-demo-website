import mongoose, { Schema, Document, Model } from "mongoose";

// Section 6 – Consent of Data Principal
export interface IConsentRecord extends Document {
  userId: mongoose.Types.ObjectId;
  purposeId: string;
  status: "granted" | "withdrawn" | "expired" | "pending";
  grantedAt?: Date;
  withdrawnAt?: Date;
  expiresAt?: Date;
  consentReceiptId: string;
  ipAddress?: string;
  userAgent?: string;
  version: number;
  language: "en" | "hi";
  // ISO/IEC 29184 receipt fields
  collectionMethod: "web_form" | "api" | "admin";
  noticeId?: string;
}

const ConsentRecordSchema = new Schema<IConsentRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    purposeId: { type: String, required: true },
    status: {
      type: String,
      enum: ["granted", "withdrawn", "expired", "pending"],
      required: true,
    },
    grantedAt: { type: Date },
    withdrawnAt: { type: Date },
    expiresAt: { type: Date },
    consentReceiptId: { type: String, required: true, unique: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    version: { type: Number, default: 1 },
    language: { type: String, enum: ["en", "hi"], default: "en" },
    collectionMethod: {
      type: String,
      enum: ["web_form", "api", "admin"],
      default: "web_form",
    },
    noticeId: { type: String },
  },
  { timestamps: true }
);

ConsentRecordSchema.index({ userId: 1, purposeId: 1 });
ConsentRecordSchema.index({ userId: 1, status: 1 });

const ConsentRecord: Model<IConsentRecord> =
  mongoose.models.ConsentRecord ??
  mongoose.model<IConsentRecord>("ConsentRecord", ConsentRecordSchema);
export default ConsentRecord;
