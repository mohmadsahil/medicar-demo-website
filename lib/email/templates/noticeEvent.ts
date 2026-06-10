import { baseLayout, ctaButton, infoCard, formatIST } from "./base";
import type { NoticeEventPayload } from "../types";

// Section 5 – Notice obligations under DPDP Act 2023
const baseUrl = process.env.NEXTAUTH_URL ?? "https://medicare.example";
const supportEmail = process.env.HOSPITAL_SUPPORT_EMAIL ?? "support@medicare.example";

export function noticeEventTemplate(
  recipientName: string,
  payload: NoticeEventPayload
): { subject: string; html: string; text: string } {
  const accepted = payload.event === "notice.accepted";
  const eventLabel = accepted ? "accepted" : "rejected";
  const badgeColor = accepted ? "#22c55e" : "#ef4444";

  const noticeLink = payload.accessToken
    ? `${payload.accessUrl}?token=${payload.accessToken}`
    : payload.accessUrl;

  const body = `
    <div style="background:${badgeColor}18;border:1px solid ${badgeColor}44;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
      <span style="background:${badgeColor};color:#fff;font-size:12px;font-weight:600;padding:3px 10px;border-radius:12px;">
        Privacy Notice ${accepted ? "Accepted" : "Rejected"}
      </span>
    </div>
    <p style="font-size:16px;color:#1e293b;">Dear ${recipientName},</p>
    <p style="font-size:15px;color:#334155;">
      ${accepted
        ? "You have accepted the MediCare Plus privacy notice. We will process your personal data as described in the notice."
        : "You have rejected the MediCare Plus privacy notice. Certain services may be unavailable until consent is granted."}
    </p>
    ${infoCard([
      { label: "Transaction ID", value: payload.transactionId },
      { label: "Date & Time (IST)", value: formatIST(payload.occurredAt) },
    ])}
    <div style="text-align:center;">
      ${ctaButton("View Full Notice", noticeLink)}
      ${ctaButton("Consent Dashboard", `${baseUrl}/consent/dashboard`, "#64748b")}
    </div>
    <div style="margin-top:24px;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:14px 16px;">
      <p style="font-size:12px;color:#9a3412;margin:0;">
        <strong>Grievance:</strong> If you believe your data rights have been violated, you may raise a grievance
        under Section 13 of the DPDP Act 2023. Contact: <a href="mailto:${supportEmail}" style="color:#9a3412;">${supportEmail}</a>
        &nbsp;|&nbsp;<a href="${baseUrl}/grievance" style="color:#9a3412;">File a Grievance</a>
      </p>
    </div>
  `;

  return {
    subject: `Privacy notice ${eventLabel} — Ref ${payload.transactionId}`,
    html: baseLayout(body, true),
    text: `Privacy Notice ${accepted ? "Accepted" : "Rejected"}\n\nTransaction ID: ${payload.transactionId}\nDate: ${formatIST(payload.occurredAt)}\n\nView notice: ${noticeLink}`,
  };
}
