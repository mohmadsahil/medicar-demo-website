import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
  name: string;
  email: string;
  phone: string;
  position: string;
  resumeName: string;
  message?: string;
  consentId?: string;
  consentUserId?: string;
  consentRecordId?: string;
  revokeUrl?: string;
  createdAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    resumeName: { type: String, required: true },
    message: { type: String, trim: true },
    consentId: { type: String, trim: true },
    consentUserId: { type: String, trim: true },
    consentRecordId: { type: String, trim: true },
    revokeUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;
