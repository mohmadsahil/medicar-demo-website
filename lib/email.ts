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
  <title>Consent Recorded – Hospital Portal</title>
</head>
<body style="margin:0;padding:0;background:#f0fdfa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfa;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,118,110,0.10);">

          <!-- Header gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#164e63 0%,#0f766e 55%,#047857 100%);padding:0;">
              <!-- dot grid overlay via background-image -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:36px 44px 32px;">
                    <!-- Brand row -->
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <img src="${"https://demo-web.digitalanumati.com"}/logo.webp" alt="Hospital Portal" width="160" height="48" style="display:block;height:48px;width:auto;object-fit:contain;" />
                        </td>
                      </tr>
                    </table>
                    <p style="margin:20px 0 4px;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">
                      Consent Recorded
                    </p>
                    <p style="margin:0;font-size:14px;color:rgba(236,254,255,0.80);line-height:1.5;">
                      Patient-first portal &middot; Consent-first data handling
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#a7f3d0,#6ee7b7,#34d399);height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 44px 8px;">
              <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#134e4a;">Hi ${name},</p>
              <p style="margin:0 0 28px;font-size:15px;color:#4b5563;line-height:1.7;">
                Thank you for using <strong style="color:#0f766e;">our Hospital Portal</strong>. Your consent has been securely recorded as part of our compliance process. Your privacy and rights are important to us.
              </p>

              <!-- Info card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;padding:20px 24px;">
                    <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#0f766e;text-transform:uppercase;letter-spacing:0.1em;">&#128274; Your Consent Rights</p>
                    <p style="margin:0 0 8px;font-size:14px;color:#374151;line-height:1.6;">
                      &#10003;&nbsp; Data processed only for agreed purposes
                    </p>
                    <p style="margin:0 0 8px;font-size:14px;color:#374151;line-height:1.6;">
                      &#10003;&nbsp; You may revoke consent at any time
                    </p>
                    <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
                      &#10003;&nbsp; Revocation stops further processing immediately
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 28px;font-size:15px;color:#4b5563;line-height:1.7;">
                To withdraw your consent and stop processing of your data, click the button below. This action takes effect immediately.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#0f766e 0%,#047857 100%);border-radius:10px;box-shadow:0 4px 14px rgba(15,118,110,0.35);">
                    <a href="${revokeUrl}"
                       style="display:inline-block;padding:15px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;letter-spacing:0.01em;">
                      &#128683;&nbsp; Manage Consent
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback URL -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
                <tr>
                  <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.1em;">If button doesn&apos;t work, use this link</p>
                    <a href="${revokeUrl}" style="font-size:12px;color:#0f766e;word-break:break-all;">${revokeUrl}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:32px 44px 0;">
              <hr style="border:none;border-top:1px solid #f3f4f6;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 44px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img src="${"https://demo-web.digitalanumati.com"}/logo.webp" alt="Hospital Portal" width="100" height="30" style="display:block;height:30px;width:auto;object-fit:contain;margin-bottom:8px;" />
                    <p style="margin:0 0 12px;font-size:12px;color:#9ca3af;line-height:1.6;">
                      This email was sent because you submitted a consent form on our Hospital Portal.<br/>
                      If you did not take this action, you can safely ignore this email.
                    </p>
                    <p style="margin:0;font-size:11px;color:#d1d5db;">
                      &copy; ${new Date().getFullYear()} Digital Anumati &middot; Consent Management Demo
                    </p>
                  </td>
                </tr>
              </table>
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
  revokeUrl: string,
): Promise<void> {
  await transporter.sendMail({
    from: `"Hospital Portal" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to: user.email,
    subject: "Your Consent Has Been Recorded – Hospital Portal",
    html: consentRevokeHtml(user.name, revokeUrl),
  });
}
