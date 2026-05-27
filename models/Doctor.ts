import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  slug: string;
  department: mongoose.Types.ObjectId;
  departmentSlug: string;
  qualification: string;
  specialization: string;
  experience: number;
  bio: string;
  image: string;
  languages: string[];
  availableDays: string[];
  consultationFee: number;
  rating: number;
  totalReviews: number;
  isActive: boolean;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    departmentSlug: { type: String, required: true },
    qualification: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    bio: { type: String, required: true },
    image: { type: String, default: "/images/doctor-placeholder.jpg" },
    languages: [{ type: String }],
    availableDays: [{ type: String }],
    consultationFee: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    totalReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Doctor: Model<IDoctor> =
  mongoose.models.Doctor ?? mongoose.model<IDoctor>("Doctor", DoctorSchema);
export default Doctor;
