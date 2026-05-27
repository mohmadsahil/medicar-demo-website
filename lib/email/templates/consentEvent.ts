import { baseLayout, ctaButton, infoCard, formatIST } from "./base";
import type { ConsentEventPayload } from "../types";

// Section 6(4) – Withdrawal of consent | Section 5 – Notice obligations
const baseUrl = process.env.NEXTAUTH_URL ?? "https://medicare.example";

interface EventMeta {
  subject: string;
  intro: string;
  badge: string;
  badgeColor: string;
}

function getEventMeta(event: ConsentEventPayload["event"], purposeName?: string): EventMeta {
  const purpose = purposeName ? `: ${purposeName}` : "";
  switch (event) {
    case "consent.created":
      return {
        subject: "Your consent has been recorded — MediCare Plus",
        intro: "We have recorded your consent with MediCare Plus Hospital.",
        badge: "Consent Recorded",
        badgeColor: "#0ea5e9",
      };
    case "consent.granted":
      return {
        subject: `Consent granted${purpose} — MediCare Plus`,
        intro: `Your consent has been granted${purpose}.`,
        badge: "Consent Granted",
        badgeColor: "#22c55e",
      };
    case "consent.withdrawn":
      return {
        subject: `Consent withdrawn${purpose} — MediCare Plus`,
        intro: `Your consent has been successfully withdrawn${purpose}. We will stop processing your data for this purpose.`,
        badge: "Consent Withdrawn",
        badgeColor: "#f59e0b",
      };
    case "consent.expired":
      return {
        subject: `Your consent has expired${purpose} — MediCare Plus`,
        intro: `Your consent has expired${purpose}. Please renew your consent to continue using related services.`,
        badge: "Consent Expired",
        badgeColor: "#ef4444",
      };
    case "consent.superseded":
      return {
        subject: "Your consent was updated (superseded) — MediCare Plus",
        intro: "Your previous consent has been superseded by an updated version. Please review the new consent terms.",
        badge: "Consent Superseded",
        badgeColor: "#8b5cf6",
      };
    case "consent.reconfirmed":
      return {
        subject: `Consent reconfirmed${purpose} — MediCare Plus`,
        intro: `Your consent has been reconfirmed${purpose}.`,
        badge: "Consent Reconfirmed",
        badgeColor: "#06b6d4",
      };
    case "consent.expiry.reminder":
      return {
        subject: `Action needed: your consent will expire soon${purpose} — MediCare Plus`,
        intro: `Your consent${purpose} is expiring soon. Please take action to renew it.`,
        badge: "Expiry Reminder",
        badgeColor: "#f97316",
      };
  }
}

export function consentEventTemplate(
  recipientName: string,
  payload: ConsentEventPayload
): { subject: string; html: string; text: string } {
  const meta = getEventMeta(payload.event, payload.purposeName);

  const body = `
    <div style="background:${meta.badgeColor}18;border:1px solid ${meta.badgeColor}44;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
      <span style="background:${meta.badgeColor};color:#fff;font-size:12px;font-weight:600;padding:3px 10px;border-radius:12px;">${meta.badge}</span>
    </div>
    <p style="font-size:16px;color:#1e293b;">Dear ${recipientName},</p>
    <p style="font-size:15px;color:#334155;">${meta.intro}</p>
    ${infoCard([
      { label: "Consent ID", value: payload.consentId },
      ...(payload.purposeName ? [{ label: "Purpose", value: payload.purposeName }] : []),
      { label: "Date & Time (IST)", value: formatIST(payload.occurredAt) },
    ])}
    <div style="text-align:center;">
      ${payload.accessUrl ? ctaButton("View Consent Receipt", payload.accessUrl) : ""}
      ${ctaButton("Consent Dashboard", `${baseUrl}/consent/dashboard`, "#64748b")}
    </div>
  `;

  return {
    subject: meta.subject,
    html: baseLayout(body, true),
    text: `${meta.badge}\n\n${meta.intro}\n\nConsent ID: ${payload.consentId}${payload.purposeName ? `\nPurpose: ${payload.purposeName}` : ""}\nDate: ${formatIST(payload.occurredAt)}\n\nManage consents: ${baseUrl}/consent/dashboard`,
  };
}
