import mongoose, { Schema, Document, Model } from "mongoose";

// Section 13 – Grievance redressal under DPDP Act 2023
export interface IGrievanceTicket extends Document {
  ticketId: string;
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  category: "data_access" | "consent" | "erasure" | "breach" | "other";
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  resolution?: string;
  dpoAssigned?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

const GrievanceTicketSchema = new Schema<IGrievanceTicket>(
  {
    ticketId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    category: {
      type: String,
      enum: ["data_access", "consent", "erasure", "breach", "other"],
      required: true,
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    resolution: { type: String },
    dpoAssigned: { type: String },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

const GrievanceTicket: Model<IGrievanceTicket> =
  mongoose.models.GrievanceTicket ??
  mongoose.model<IGrievanceTicket>("GrievanceTicket", GrievanceTicketSchema);
export default GrievanceTicket;
