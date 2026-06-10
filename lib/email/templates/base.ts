const hospitalName = process.env.HOSPITAL_NAME ?? "MediCare Plus Hospital";
const hospitalAddress = process.env.HOSPITAL_ADDRESS ?? "123 Healthcare Avenue, Mumbai 400050";
const supportEmail = process.env.HOSPITAL_SUPPORT_EMAIL ?? "support@medicare.example";
const dpoEmail = process.env.HOSPITAL_DPO_EMAIL ?? "dpo@medicare.example";
const baseUrl = process.env.NEXTAUTH_URL ?? "https://medicare.example";

export function baseLayout(body: string, showUnsubscribe = false): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${hospitalName}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%);padding:28px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div style="display:inline-block;background:#fff;border-radius:8px;padding:6px 12px;margin-bottom:8px;">
                  <span style="font-size:22px;">🏥</span>
                </div>
                <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">${hospitalName}</div>
                <div style="color:#bae6fd;font-size:13px;margin-top:2px;">Compassionate Care · Advanced Medicine</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Body -->
      <tr>
        <td style="padding:36px 40px;">
          ${body}
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:12px;color:#64748b;line-height:1.6;">
                <div style="font-weight:600;color:#334155;margin-bottom:4px;">${hospitalName}</div>
                <div>${hospitalAddress}</div>
                <div>Support: <a href="mailto:${supportEmail}" style="color:#0ea5e9;text-decoration:none;">${supportEmail}</a></div>
                <div style="margin-top:8px;padding:8px;background:#eff6ff;border-left:3px solid #3b82f6;border-radius:4px;font-size:11px;color:#1e40af;">
                  <strong>DPDP Act 2023:</strong> ${hospitalName} is a Data Fiduciary registered under the Digital Personal Data Protection Act 2023 (India).
                  Data Principal rights: <a href="mailto:${dpoEmail}" style="color:#1d4ed8;">${dpoEmail}</a>
                  &nbsp;|&nbsp;<a href="${baseUrl}/privacy-policy" style="color:#1d4ed8;">Privacy Policy</a>
                </div>
                ${showUnsubscribe ? `<div style="margin-top:8px;"><a href="${baseUrl}/consent/preferences" style="color:#94a3b8;font-size:11px;">Manage email preferences</a></div>` : ""}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export function ctaButton(text: string, href: string, color = "#0ea5e9"): string {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#ffffff;font-size:15px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;margin:16px 0;">${text}</a>`;
}

export function infoCard(rows: { label: string; value: string }[]): string {
  const items = rows
    .map(
      (r) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;width:40%;">${r.label}</td>
         <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#1e293b;font-weight:500;">${r.value}</td></tr>`
    )
    .join("");
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin:16px 0;overflow:hidden;">
    <tbody>${items}</tbody>
  </table>`;
}

export function formatIST(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" });
  } catch {
    return isoString;
  }
}
