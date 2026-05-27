import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICookiePreference extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionId?: string;
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  updatedAt: Date;
}

const CookiePreferenceSchema = new Schema<ICookiePreference>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", sparse: true },
    sessionId: { type: String, sparse: true },
    necessary: { type: Boolean, default: true },
    analytics: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
    functional: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CookiePreference: Model<ICookiePreference> =
  mongoose.models.CookiePreference ??
  mongoose.model<ICookiePreference>("CookiePreference", CookiePreferenceSchema);
export default CookiePreference;
