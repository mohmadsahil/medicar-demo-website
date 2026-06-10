export interface EmailRecipient {
  name: string;
  email: string;
}

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  tags?: string[];
}

export interface OtpEmailPayload {
  name?: string;
  email: string;
  otp: string;
  expiryMinutes: number;
}

export interface AppointmentEmailPayload {
  name: string;
  email: string;
  appointment: {
    doctorName: string;
    department: string;
    dateTime: string;
    location: string;
    appointmentId: string;
    consentReceiptId?: string;
  };
}

export interface ConsentEventPayload {
  event:
    | "consent.created"
    | "consent.granted"
    | "consent.withdrawn"
    | "consent.expired"
    | "consent.superseded"
    | "consent.reconfirmed"
    | "consent.expiry.reminder";
  consentId: string;
  recordId: string;
  occurredAt: string;
  purposeName?: string;
  accessUrl?: string;
}

export interface NoticeEventPayload {
  event: "notice.accepted" | "notice.rejected";
  recordId: string;
  transactionId: string;
  occurredAt: string;
  tenantPrincipalId: string;
  accessUrl: string;
  accessToken: string;
}

export interface WelcomeEmailPayload {
  name: string;
  email: string;
  grantedPurposes: string[];
}
