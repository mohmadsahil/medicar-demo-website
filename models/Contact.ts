import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  consentId?: string;
  consentUserId?: string;
  consentRecordId?: string;
  referenceId?: string;
  revokeUrl?: string;
  consentGranted: boolean;
  consentRevoked: boolean;
  consentErased: boolean;
  consentAutoExpired: boolean;
  consentExtended: boolean;
  consentUpdated: boolean;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, required: true, trim: true },
    consentId: { type: String, trim: true },
    consentUserId: { type: String, trim: true },
    consentRecordId: { type: String, trim: true },
    referenceId: { type: String, trim: true, index: true },
    revokeUrl: { type: String, trim: true },
    consentGranted: { type: Boolean, default: false },
    consentRevoked: { type: Boolean, default: false },
    consentErased: { type: Boolean, default: false },
    consentAutoExpired: { type: Boolean, default: false },
    consentExtended: { type: Boolean, default: false },
    consentUpdated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
