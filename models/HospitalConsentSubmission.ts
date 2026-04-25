import mongoose, { Document, Model, Schema } from "mongoose";

export interface IHospitalConsentSubmission extends Document {
  patientName: string;
  doctorName: string;
  patientHistory: string;
  dateOfBirth: string;
  gender: string;
  patientId?: string;
  phone: string;
  email: string;
  address: string;
  doctorNotes?: string;
  prescriptions?: string;
  allergies?: string;
  medicalHistory?: string;
  visitType: string;
  appointmentDateTime: string;
  department: string;
  preferredDoctor?: string;
  billingAddress: string;
  transactionDetails: string;
  paymentMethod: string;
  insuranceProvider: string;
  coverageDetails: string;
  policyNumber: string;
  consentId?: string;
  consentUserId?: string;
  consentRecordId?: string;
  referenceId?: string;
  revokeUrl?: string;
  categories: {
    coreHealthcareServices: boolean;
    billingAndInsurance: boolean;
    communicationAndEngagement: boolean;
  };
  consentLanguage: string;
  consentTemplateId: string;
  consentVersion: string;
  consentStatus: "granted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const HospitalConsentSubmissionSchema = new Schema<IHospitalConsentSubmission>(
  {
    patientName: { type: String, required: true, trim: true },
    doctorName: { type: String, required: true, trim: true },
    patientHistory: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    patientId: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, required: true, trim: true },
    doctorNotes: { type: String, trim: true },
    prescriptions: { type: String, trim: true },
    allergies: { type: String, trim: true },
    medicalHistory: { type: String, trim: true },
    visitType: { type: String, required: true, trim: true },
    appointmentDateTime: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    preferredDoctor: { type: String, trim: true },
    billingAddress: { type: String, required: true, trim: true },
    transactionDetails: { type: String, required: true, trim: true },
    paymentMethod: { type: String, required: true, trim: true },
    insuranceProvider: { type: String, required: true, trim: true },
    coverageDetails: { type: String, required: true, trim: true },
    policyNumber: { type: String, required: true, trim: true },
    consentId: { type: String, trim: true },
    consentUserId: { type: String, trim: true },
    consentRecordId: { type: String, trim: true },
    referenceId: { type: String, trim: true, index: true },
    revokeUrl: { type: String, trim: true },
    categories: {
      coreHealthcareServices: { type: Boolean, default: true },
      billingAndInsurance: { type: Boolean, default: true },
      communicationAndEngagement: { type: Boolean, default: false },
    },
    consentLanguage: { type: String, required: true, trim: true },
    consentTemplateId: { type: String, required: true, trim: true },
    consentVersion: { type: String, required: true, trim: true },
    consentStatus: {
      type: String,
      enum: ["granted", "rejected"],
      default: "granted",
      required: true,
    },
  },
  { timestamps: true },
);

const HospitalConsentSubmission: Model<IHospitalConsentSubmission> =
  mongoose.models.HospitalConsentSubmission ||
  mongoose.model<IHospitalConsentSubmission>(
    "HospitalConsentSubmission",
    HospitalConsentSubmissionSchema,
  );

export default HospitalConsentSubmission;
