import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
  company?: string;
  bio?: string;
  consentId?: string;
  consentUserId?: string;
  consentRecordId?: string;
  revokeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    role: { type: String, trim: true },
    company: { type: String, trim: true },
    bio: { type: String, trim: true },
    consentId: { type: String, trim: true },
    consentUserId: { type: String, trim: true },
    consentRecordId: { type: String, trim: true },
    revokeUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
