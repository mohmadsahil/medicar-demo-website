import { sendMail } from "./send";
import { otpVerificationTemplate } from "./templates/otpVerification";
import {
  appointmentConfirmationTemplate,
  appointmentReminderTemplate,
  appointmentCancelledTemplate,
} from "./templates/appointmentConfirmation";
import { consentEventTemplate } from "./templates/consentEvent";
import { noticeEventTemplate } from "./templates/noticeEvent";
import { welcomeTemplate } from "./templates/welcome";
import type {
  OtpEmailPayload,
  AppointmentEmailPayload,
  ConsentEventPayload,
  NoticeEventPayload,
  WelcomeEmailPayload,
} from "./types";

export async function sendOtpEmail(payload: OtpEmailPayload): Promise<void> {
  const { subject, html, text } = otpVerificationTemplate(payload);
  await sendMail({ to: payload.email, subject, html, text, tags: ["otp"] });
}

export async function sendAppointmentConfirmationEmail(payload: AppointmentEmailPayload): Promise<void> {
  const { subject, html, text } = appointmentConfirmationTemplate(payload);
  await sendMail({ to: payload.email, subject, html, text, tags: ["appointment"] });
}

export async function sendAppointmentReminderEmail(payload: AppointmentEmailPayload): Promise<void> {
  const { subject, html, text } = appointmentReminderTemplate(payload);
  await sendMail({ to: payload.email, subject, html, text, tags: ["appointment", "reminder"] });
}

export async function sendAppointmentCancelledEmail(
  payload: AppointmentEmailPayload & { cancellationReason?: string }
): Promise<void> {
  const { subject, html, text } = appointmentCancelledTemplate(payload);
  await sendMail({ to: payload.email, subject, html, text, tags: ["appointment", "cancelled"] });
}

export async function sendConsentEventEmail(
  recipient: { name: string; email: string },
  payload: ConsentEventPayload
): Promise<void> {
  const { subject, html, text } = consentEventTemplate(recipient.name, payload);
  await sendMail({ to: recipient.email, subject, html, text, tags: ["consent"] });
}

export async function sendNoticeEventEmail(
  recipient: { name: string; email: string },
  payload: NoticeEventPayload
): Promise<void> {
  const { subject, html, text } = noticeEventTemplate(recipient.name, payload);
  await sendMail({ to: recipient.email, subject, html, text, tags: ["notice"] });
}

export async function sendWelcomeEmail(payload: WelcomeEmailPayload): Promise<void> {
  const { subject, html, text } = welcomeTemplate(payload);
  await sendMail({ to: payload.email, subject, html, text, tags: ["welcome"] });
}
