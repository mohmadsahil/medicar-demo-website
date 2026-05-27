import { baseLayout, ctaButton } from "./base";
import type { WelcomeEmailPayload } from "../types";

// Section 5 – Notice obligations: inform user of data processing on first signup
const baseUrl = process.env.NEXTAUTH_URL ?? "https://medicare.example";

export function welcomeTemplate(payload: WelcomeEmailPayload): { subject: string; html: string; text: string } {
  const { name, grantedPurposes } = payload;

  const purposeList = grantedPurposes.length
    ? `<ul style="font-size:13px;color:#334155;margin:0;padding-left:20px;line-height:1.8;">${grantedPurposes.map((p) => `<li>${p}</li>`).join("")}</ul>`
    : "";

  const body = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:48px;">🎉</div>
      <h1 style="font-size:24px;font-weight:700;color:#0f172a;margin:8px 0 4px;">Welcome, ${name}!</h1>
      <p style="font-size:15px;color:#64748b;margin:0;">Your MediCare Plus account is ready</p>
    </div>
    <p style="font-size:15px;color:#334155;">Thank you for registering with MediCare Plus Hospital. You now have full access to our patient portal and healthcare services.</p>
    <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:20px 0;">
      <div style="font-size:14px;font-weight:600;color:#0369a1;margin-bottom:8px;">What you can do:</div>
      <ul style="font-size:13px;color:#334155;margin:0;padding-left:20px;line-height:1.9;">
        <li>Book appointments with our specialist doctors</li>
        <li>Access your medical records and reports</li>
        <li>Manage your consent preferences</li>
        <li>Track your health packages</li>
        <li>Exercise your Data Principal rights under DPDP Act 2023</li>
      </ul>
    </div>
    ${grantedPurposes.length ? `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;">
      <div style="font-size:14px;font-weight:600;color:#15803d;margin-bottom:8px;">Consents granted at signup (Section 6 – DPDP Act 2023):</div>
      ${purposeList}
    </div>` : ""}
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:14px 16px;margin:20px 0;">
      <p style="font-size:12px;color:#9a3412;margin:0;">
        <strong>Your Data Rights:</strong> Under the Digital Personal Data Protection Act 2023, you have the right to
        access, correct, and erase your personal data, and to withdraw consent at any time.
        <a href="${baseUrl}/consent/dashboard" style="color:#9a3412;">Manage your consents</a> |
        <a href="${baseUrl}/privacy-policy" style="color:#9a3412;">Privacy Policy</a>
      </p>
    </div>
    <div style="text-align:center;">
      ${ctaButton("Go to Patient Portal", `${baseUrl}/portal`)}
    </div>
  `;

  return {
    subject: `Welcome to MediCare Plus Hospital, ${name}!`,
    html: baseLayout(body),
    text: `Welcome, ${name}!\n\nThank you for joining MediCare Plus Hospital. Visit your patient portal: ${baseUrl}/portal`,
  };
}
