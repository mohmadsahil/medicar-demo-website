import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function consentRevokeHtml(name: string, revokeUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Consent Reference – Demo</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:32px 40px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">demo</p>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.75);">Enterprise Platform</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 24px;">
              <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">Hi ${name},</p>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
                Thank you for submitting your information to Demo. We have recorded your consent as part of our compliance process.
              </p>

              <p style="margin:0 0 12px;font-size:15px;color:#374151;line-height:1.6;">
                You have the right to revoke your consent at any time. To do so, simply click the button below.
                Revoking consent will stop the processing of your data for the purpose you consented to.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr>
                  <td style="background:#2563eb;border-radius:8px;">
                    <a href="${revokeUrl}"
                       style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                      Revoke My Consent
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;line-height:1.5;">
                If the button does not work, copy and paste the link below into your browser:
              </p>
              <p style="margin:0;font-size:12px;color:#6b7280;word-break:break-all;">
                <a href="${revokeUrl}" style="color:#2563eb;">${revokeUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #f3f4f6;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;line-height:1.6;">
                This email was sent because you submitted a form on the Demo platform.
                If you did not take this action, you can safely ignore this email.
              </p>
              <p style="margin:0;font-size:12px;color:#d1d5db;">
                © ${new Date().getFullYear()} Demo Inc. · 123 Innovation Drive, San Francisco, CA 94107
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendConsentRevokeEmail(
  user: { name: string; email: string },
  revokeUrl: string
): Promise<void> {
  await transporter.sendMail({
    from: `"Demo" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to: user.email,
    subject: "Your Consent Reference – Demo",
    html: consentRevokeHtml(user.name, revokeUrl),
  });
}
