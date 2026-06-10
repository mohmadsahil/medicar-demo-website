import mongoose, { Schema, Document, Model } from "mongoose";

// Section 11/12/13/14 – Data Principal Rights
export interface IDataPrincipalRequest extends Document {
  userId: mongoose.Types.ObjectId;
  requestType: "access" | "correction" | "erasure" | "portability" | "nomination";
  status: "pending" | "in_progress" | "completed" | "rejected";
  description: string;
  responseNote?: string;
  dueDate: Date;
  completedAt?: Date;
  createdAt: Date;
}

const DataPrincipalRequestSchema = new Schema<IDataPrincipalRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestType: {
      type: String,
      enum: ["access", "correction", "erasure", "portability", "nomination"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "rejected"],
      default: "pending",
    },
    description: { type: String, required: true },
    responseNote: { type: String },
    dueDate: { type: Date, required: true },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

DataPrincipalRequestSchema.index({ userId: 1, createdAt: -1 });

const DataPrincipalRequest: Model<IDataPrincipalRequest> =
  mongoose.models.DataPrincipalRequest ??
  mongoose.model<IDataPrincipalRequest>("DataPrincipalRequest", DataPrincipalRequestSchema);
export default DataPrincipalRequest;
