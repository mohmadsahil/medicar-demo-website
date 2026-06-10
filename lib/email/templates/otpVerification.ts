import { baseLayout } from "./base";
import type { OtpEmailPayload } from "../types";

export function otpVerificationTemplate(payload: OtpEmailPayload): { subject: string; html: string; text: string } {
  const { name, otp, expiryMinutes } = payload;
  const greeting = name ? `Hi ${name},` : "Hello,";

  const body = `
    <p style="font-size:16px;color:#1e293b;margin:0 0 20px;">${greeting}</p>
    <p style="font-size:15px;color:#334155;margin:0 0 24px;">
      Your verification code for MediCare Plus Hospital is:
    </p>
    <div style="text-align:center;margin:24px 0;">
      <div style="display:inline-block;background:#f0f9ff;border:2px dashed #0ea5e9;border-radius:12px;padding:20px 40px;">
        <span style="font-size:40px;font-weight:700;letter-spacing:12px;color:#0284c7;font-family:monospace;">${otp}</span>
      </div>
    </div>
    <p style="font-size:14px;color:#64748b;margin:16px 0 8px;text-align:center;">
      This code expires in <strong>${expiryMinutes} minutes</strong>.
    </p>
    <div style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:12px 16px;margin:20px 0;">
      <p style="font-size:13px;color:#713f12;margin:0;">
        <strong>Security notice:</strong> MediCare Plus will never ask for this code over phone or email.
        If you didn't request this, please ignore this message.
      </p>
    </div>
  `;

  const text = `${greeting}\n\nYour MediCare Plus verification code: ${otp}\nExpires in ${expiryMinutes} minutes.\n\nDo not share this code with anyone.`;

  return {
    subject: `Your MediCare Plus verification code: ${otp}`,
    html: baseLayout(body),
    text,
  };
}
