import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConsentTransaction extends Document {
  transactionId: string;        // from Anumati widget (window.daTransactionId)
  referenceId: string;          // DA-REF-XXXXXXXX — our generated ref for this user
  userId: mongoose.Types.ObjectId;
  email?: string;
  mobile?: string;
  verifiedAt: Date;
  purposes: string[];           // purposeIds from verify response
  transactionDetail: Record<string, unknown>; // raw verify response
  createdAt: Date;
}

const ConsentTransactionSchema = new Schema<IConsentTransaction>(
  {
    transactionId: { type: String, required: true, unique: true },
    referenceId:   { type: String, required: true },
    userId:        { type: Schema.Types.ObjectId, ref: "User", required: true },
    email:         { type: String },
    mobile:        { type: String },
    verifiedAt:    { type: Date, required: true },
    purposes:      [{ type: String }],
    transactionDetail: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

ConsentTransactionSchema.index({ userId: 1 });
ConsentTransactionSchema.index({ referenceId: 1 });

const ConsentTransaction: Model<IConsentTransaction> =
  mongoose.models.ConsentTransaction ??
  mongoose.model<IConsentTransaction>("ConsentTransaction", ConsentTransactionSchema);

export default ConsentTransaction;
