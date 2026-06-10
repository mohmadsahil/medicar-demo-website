import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtpRequest extends Document {
  identifier: string;
  identifierType: "email" | "phone";
  otpHash: string;
  provider: "static" | "email" | "sms";
  attempts: number;
  expiresAt: Date;
  consumedAt?: Date;
  createdAt: Date;
}

const OtpRequestSchema = new Schema<IOtpRequest>(
  {
    identifier: { type: String, required: true },
    identifierType: { type: String, enum: ["email", "phone"], required: true },
    otpHash: { type: String, required: true },
    provider: { type: String, enum: ["static", "email", "sms"], required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    consumedAt: { type: Date },
  },
  { timestamps: true }
);

OtpRequestSchema.index({ identifier: 1, createdAt: -1 });
OtpRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpRequest: Model<IOtpRequest> =
  mongoose.models.OtpRequest ?? mongoose.model<IOtpRequest>("OtpRequest", OtpRequestSchema);
export default OtpRequest;
