import { getTransporter } from "./client";
import type { SendMailOptions } from "./types";

export async function sendMail(options: SendMailOptions): Promise<void> {
  const { to, subject, html, text } = options;
  const transport = getTransporter();

  if (!transport) {
    console.log(`[EMAIL DEV] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL DEV] (SMTP not configured — email not sent)`);
    return;
  }

  const from = process.env.SMTP_FROM ?? `MediCare Plus <no-reply@medicare.example>`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await transport.sendMail({ from, to, subject, html, text: text ?? "" });
      console.log(`[EMAIL] Sent to ${to} — ${subject}`);
      return;
    } catch (err: unknown) {
      if (attempt === 2) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[EMAIL] Failed sending to ${to}: ${message}`);
        throw err;
      }
    }
  }
}
