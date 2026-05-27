import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email?: string;
  phone?: string;
  dob?: Date;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  isVerified: boolean;
  referenceId?: string; // DPDP consent manager reference
  role: "patient" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: false, trim: true, default: "" },
    email: { type: String, sparse: true, lowercase: true, trim: true },
    phone: { type: String, sparse: true, trim: true },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other", "prefer_not_to_say"] },
    isVerified: { type: Boolean, default: false },
    referenceId: { type: String },
    role: { type: String, enum: ["patient", "admin"], default: "patient" },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { sparse: true, unique: true });
UserSchema.index({ phone: 1 }, { sparse: true, unique: true });
UserSchema.index({ referenceId: 1 }, { sparse: true, unique: true });

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);
export default User;
