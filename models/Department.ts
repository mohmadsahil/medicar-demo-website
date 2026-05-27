import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  image: string;
  services: string[];
  isActive: boolean;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    icon: { type: String, required: true },
    image: { type: String, default: "/images/dept-placeholder.jpg" },
    services: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Department: Model<IDepartment> =
  mongoose.models.Department ?? mongoose.model<IDepartment>("Department", DepartmentSchema);
export default Department;
