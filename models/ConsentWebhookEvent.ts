import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConsentWebhookEvent extends Document {
  event: string;
  payload: Record<string, unknown>;
  signatureValid: boolean;
  processedAt: Date;
  emailSent: boolean;
  errorMessage?: string;
  recipientEmail?: string;
  postbackSent?: boolean;
  postbackPayload?: Record<string, unknown>;
  postbackResponse?: Record<string, unknown>;
  postbackStatus?: string;
  postbackSentAt?: Date;
  createdAt: Date;
}

const ConsentWebhookEventSchema = new Schema<IConsentWebhookEvent>(
  {
    event: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    signatureValid: { type: Boolean, required: true },
    processedAt: { type: Date, required: true },
    emailSent: { type: Boolean, default: false },
    errorMessage: { type: String },
    recipientEmail: { type: String },
    postbackSent: { type: Boolean, default: false },
    postbackPayload: { type: Schema.Types.Mixed },
    postbackResponse: { type: Schema.Types.Mixed },
    postbackStatus: { type: String },
    postbackSentAt: { type: Date },
  },
  { timestamps: true }
);

ConsentWebhookEventSchema.index({ event: 1, createdAt: -1 });
ConsentWebhookEventSchema.index({ signatureValid: 1 });

const ConsentWebhookEvent: Model<IConsentWebhookEvent> =
  mongoose.models.ConsentWebhookEvent ??
  mongoose.model<IConsentWebhookEvent>("ConsentWebhookEvent", ConsentWebhookEventSchema);
export default ConsentWebhookEvent;
