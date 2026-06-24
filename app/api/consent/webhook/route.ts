import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ConsentWebhookEvent from "@/models/ConsentWebhookEvent";

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
  metadata?: { source?: string };
  accessUrl?: string;
  accessToken?: string;
  occurredAt?: string;
}

function verifySignature(signature: string | null): boolean {
  const secret = process.env.WEBHOOK_NOTICE_SECRET;
  if (!secret) return true; // no secret configured — accept all
  if (!signature) return false;
  try {
    const sigBuf = Buffer.from(signature);
    const secretBuf = Buffer.from(secret);
    if (sigBuf.length !== secretBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, secretBuf);
  } catch {
    return false;
  }
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

  // test requests (source = webhook_test) → confirm only, no log
  if (body.metadata?.source === "webhook_test") {
    return NextResponse.json({ received: true, event });
  }

  await connectDB();

  await ConsentWebhookEvent.create({
    event,
    payload: body as unknown as Record<string, unknown>,
    signatureValid,
    processedAt: new Date(),
  });

  return NextResponse.json({ received: true, event });
}
