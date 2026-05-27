import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import ConsentWebhookEvent from "@/models/ConsentWebhookEvent";
import { sendConsentEventEmail, sendNoticeEventEmail } from "@/lib/email";
import type { ConsentEventPayload, NoticeEventPayload } from "@/lib/email/types";

const CONSENT_EVENTS = new Set([
  "consent.created",
  "consent.granted",
  "consent.withdrawn",
  "consent.expired",
  "consent.superseded",
  "consent.reconfirmed",
  "consent.expiry.reminder",
]);

const NOTICE_EVENTS = new Set(["notice.accepted", "notice.rejected"]);

interface WebhookBody {
  id?: string;
  data?: {
    referenceId?: string;
    consentId?: string;
    transactionId?: string;
    tenantPrincipalId?: string;
    noticeType?: string;
    consentStatus?: string;
    purpose?: { name?: string };
  };
  accessUrl?: string;
  accessToken?: string;
  occurredAt?: string;
}

function verifySignature(signature: string | null): boolean {
  const secret = process.env.WEBHOOK_NOTICE_SECRET;
  if (!signature || !secret) return false;
  try {
    const sigBuf = Buffer.from(signature);
    const secretBuf = Buffer.from(secret);
    if (sigBuf.length !== secretBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, secretBuf);
  } catch {
    return false;
  }
}

async function resolveRecipient(
  referenceId?: string
): Promise<{ name: string; email: string } | null> {
  if (referenceId) {
    // referenceId is the user's email address in the consent manager
    const user = await User.findOne({
      $or: [{ email: referenceId }, { referenceId }],
    });
    if (user?.email) return { name: user.name || "Patient", email: user.email };
    // If no user found but referenceId looks like an email, use it directly
    if (referenceId.includes("@")) return { name: "Patient", email: referenceId };
  }
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) return { name: "Admin", email: adminEmail };
  return null;
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-webhook-signature");
  const signatureValid = verifySignature(signature);

  if (!signatureValid) {
    return NextResponse.json(
      { error: "Unauthorized: invalid webhook signature." },
      { status: 401 }
    );
  }

  const event = req.headers.get("x-webhook-event") ?? "";
  const isConsent = CONSENT_EVENTS.has(event);
  const isNotice = NOTICE_EVENTS.has(event);

  if (!isConsent && !isNotice) {
    return NextResponse.json(
      { error: `Unsupported event type: ${event}` },
      { status: 400 }
    );
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
  }

  let body: WebhookBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate required fields per event type
  if (isConsent && !body.data?.consentId) {
    return NextResponse.json({ error: "Missing data.consentId for consent event" }, { status: 400 });
  }
  if (isNotice && (!body.data?.transactionId || !body.data?.tenantPrincipalId || !body.accessUrl || !body.accessToken)) {
    return NextResponse.json({ error: "Missing required fields for notice event" }, { status: 400 });
  }

  await connectDB();

  const processedAt = new Date();
  let emailSent = false;
  let errorMessage: string | undefined;
  let recipientEmail: string | undefined;

  try {
    const recipient = await resolveRecipient(body.data?.referenceId);

    if (recipient) {
      recipientEmail = recipient.email;

      if (isConsent) {
        const payload: ConsentEventPayload = {
          event: event as ConsentEventPayload["event"],
          consentId: body.data!.consentId!,
          recordId: body.id ?? "",
          occurredAt: body.occurredAt ?? new Date().toISOString(),
          purposeName: body.data?.purpose?.name,
          accessUrl: body.accessUrl,
        };
        await sendConsentEventEmail(recipient, payload);
      } else {
        const payload: NoticeEventPayload = {
          event: event as NoticeEventPayload["event"],
          recordId: body.id ?? "",
          transactionId: body.data!.transactionId!,
          occurredAt: body.occurredAt ?? new Date().toISOString(),
          tenantPrincipalId: body.data!.tenantPrincipalId!,
          accessUrl: body.accessUrl!,
          accessToken: body.accessToken!,
        };
        await sendNoticeEventEmail(recipient, payload);
      }
      emailSent = true;
    } else {
      errorMessage = "No recipient resolved (no matching user and ADMIN_EMAIL not set)";
      console.error(`[WEBHOOK] ${errorMessage} for event ${event}`);
    }
  } catch (err: unknown) {
    errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`[WEBHOOK] Email dispatch failed for ${event}: ${errorMessage}`);
  }

  // Audit every received webhook — Section 8(6) DPDP Act accountability
  await ConsentWebhookEvent.create({
    event,
    payload: body as unknown as Record<string, unknown>,
    signatureValid,
    processedAt,
    emailSent,
    errorMessage,
    recipientEmail,
  });

  if (errorMessage && !emailSent) {
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  return NextResponse.json({ message: `${event} — email dispatched.` });
}
