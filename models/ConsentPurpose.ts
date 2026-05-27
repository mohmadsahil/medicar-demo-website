import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConsentPurpose extends Document {
  purposeId: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  legalBasis: string;
  dataCategories: string[];
  retentionPeriod: string;
  isMandatory: boolean;
  isActive: boolean;
  version: number;
  // Section 5 – Notice obligations
  processingDetails: string;
  thirdPartySharing: boolean;
  thirdParties?: string[];
}

const ConsentPurposeSchema = new Schema<IConsentPurpose>(
  {
    purposeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameHi: { type: String, required: true },
    description: { type: String, required: true },
    descriptionHi: { type: String, required: true },
    legalBasis: { type: String, required: true },
    dataCategories: [{ type: String }],
    retentionPeriod: { type: String, required: true },
    isMandatory: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    version: { type: Number, default: 1 },
    processingDetails: { type: String, required: true },
    thirdPartySharing: { type: Boolean, default: false },
    thirdParties: [{ type: String }],
  },
  { timestamps: true }
);

const ConsentPurpose: Model<IConsentPurpose> =
  mongoose.models.ConsentPurpose ??
  mongoose.model<IConsentPurpose>("ConsentPurpose", ConsentPurposeSchema);
export default ConsentPurpose;
