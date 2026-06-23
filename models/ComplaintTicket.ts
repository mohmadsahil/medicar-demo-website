import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComplaintTicket extends Document {
  ticketId: string;
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  department: string;
  category: "staff_behaviour" | "treatment_quality" | "billing" | "facility" | "waiting_time" | "food_amenities" | "appointment" | "other";
  priority: "low" | "medium" | "high";
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  resolution?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

const ComplaintTicketSchema = new Schema<IComplaintTicket>(
  {
    ticketId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    department: { type: String, required: true },
    category: {
      type: String,
      enum: ["staff_behaviour", "treatment_quality", "billing", "facility", "waiting_time", "food_amenities", "appointment", "other"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    resolution: { type: String },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

const ComplaintTicket: Model<IComplaintTicket> =
  mongoose.models.ComplaintTicket ??
  mongoose.model<IComplaintTicket>("ComplaintTicket", ComplaintTicketSchema);
export default ComplaintTicket;
