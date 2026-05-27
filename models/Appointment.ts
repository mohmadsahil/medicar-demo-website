import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId;
  dateTime: Date;
  status: "scheduled" | "confirmed" | "cancelled" | "completed";
  reason: string;
  notes?: string;
  consentReceiptId?: string;
  reminderSent: boolean;
  cancellationReason?: string;
  createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    dateTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "cancelled", "completed"],
      default: "scheduled",
    },
    reason: { type: String, required: true },
    notes: { type: String },
    consentReceiptId: { type: String },
    reminderSent: { type: Boolean, default: false },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

AppointmentSchema.index({ userId: 1, dateTime: -1 });
AppointmentSchema.index({ doctorId: 1, dateTime: 1 });

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ??
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
export default Appointment;
