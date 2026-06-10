import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHealthPackage extends Document {
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  tests: string[];
  reportDelivery: string;
  fasting: boolean;
  homeCollection: boolean;
  isActive: boolean;
  isPopular: boolean;
}

const HealthPackageSchema = new Schema<IHealthPackage>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    tests: [{ type: String }],
    reportDelivery: { type: String, default: "24 Hours" },
    fasting: { type: Boolean, default: false },
    homeCollection: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const HealthPackage: Model<IHealthPackage> =
  mongoose.models.HealthPackage ??
  mongoose.model<IHealthPackage>("HealthPackage", HealthPackageSchema);
export default HealthPackage;
