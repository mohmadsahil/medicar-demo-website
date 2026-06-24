import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

function verifySignature(rawBody: Buffer, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBytes = await req.arrayBuffer();
  const rawBody = Buffer.from(rawBytes);

  const signature = req.headers.get("x-da-signature") ?? "";
  const secret = process.env.DA_WEBHOOK_SECRET ?? "";

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Respond immediately — DPDP Act SLA requires processing within 1h/24h,
  // not response time. Heavy work happens after 200 is sent.
  const response = NextResponse.json({ received: true });
  processEvent(event).catch((e) => console.error("[DA webhook] processEvent failed:", e));
  return response;
}

async function processEvent(event: Record<string, unknown>) {
  const eventType = event.event as string;
  const dispatchId = event.dispatchId as string;
  const referenceId = event.referenceId as string;

  console.log("[DA webhook]", eventType, referenceId);

  if (eventType === "consent.withdrawn") {
    await handleConsentWithdrawn(dispatchId, referenceId);
  } else if (eventType === "data.deleted") {
    await handleDataDeleted(dispatchId, referenceId);
  } else if (eventType === "consent.captured") {
    console.log("[DA] New consent captured for", referenceId);
  } else if (eventType === "consent.granted") {
    console.log("[DA] Consent re-granted for", referenceId);
  } else if (eventType === "consent.expired") {
    console.log("[DA] Consent expired for", referenceId);
  } else if (eventType === "consent.expiry.reminder") {
    console.log("[DA] Consent expiring soon for", referenceId);
  } else {
    console.log("[DA webhook] Unhandled event type:", eventType);
  }
}

async function handleConsentWithdrawn(dispatchId: string, referenceId: string) {
  const baseUrl = process.env.DIGITAL_ANUMATI_BASE_URL ?? "http://localhost:5001";
  const secretKey = process.env.DIGITAL_ANUMATI_API_KEY ?? "";

  try {
    console.log("[DA] Processing withdrawal for", referenceId);

    // YOUR BUSINESS LOGIC HERE:
    // await unsubscribeFromEmails(referenceId)
    // await updateCRM(referenceId, 'withdrawn')
    // await stopScheduledJobs(referenceId)

    const res = await fetch(`${baseUrl}/api/v1/server/app/consents/withdraw/confirm`, {
      method: "POST",
      headers: {
        "x-secret-key": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dispatchId,
        referenceId,
        status: "processed",
        processedAt: new Date().toISOString(),
        actions: [
          { type: "email_unsubscribed", result: "success" },
          { type: "crm_updated", result: "success" },
        ],
        remark: "",
      }),
    });

    const result = await res.json().catch(() => ({}));
    console.log("[DA] Withdrawal confirmed:", (result as Record<string, unknown>)?.data);
  } catch (error) {
    console.error("[DA] Failed to process withdrawal:", error);

    await fetch(`${baseUrl}/api/v1/server/app/consents/withdraw/confirm`, {
      method: "POST",
      headers: { "x-secret-key": secretKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        dispatchId,
        referenceId,
        status: "failed",
        processedAt: new Date().toISOString(),
        actions: [],
        remark: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      }),
    }).catch((e) => console.error("[DA] Postback failed too:", e));
  }
}

async function handleDataDeleted(dispatchId: string, referenceId: string) {
  const baseUrl = process.env.DIGITAL_ANUMATI_BASE_URL ?? "http://localhost:5001";
  const secretKey = process.env.DIGITAL_ANUMATI_API_KEY ?? "";

  try {
    console.log("[DA] Processing data deletion for", referenceId);

    // YOUR BUSINESS LOGIC HERE:
    // await deleteBookingRecords(referenceId)
    // await deleteHealthData(referenceId)
    // await anonymiseContactInfo(referenceId)

    const deletedDataTypes = ["booking_records", "contact_info"];

    const res = await fetch(`${baseUrl}/api/v1/server/app/consents/data-deleted/confirm`, {
      method: "POST",
      headers: {
        "x-secret-key": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dispatchId,
        referenceId,
        status: "deleted",
        deletedAt: new Date().toISOString(),
        dataTypes: deletedDataTypes,
        remark: "",
      }),
    });

    const result = await res.json().catch(() => ({}));
    console.log("[DA] Deletion confirmed:", (result as Record<string, unknown>)?.data);
  } catch (error) {
    console.error("[DA] Failed to process deletion:", error);

    await fetch(`${baseUrl}/api/v1/server/app/consents/data-deleted/confirm`, {
      method: "POST",
      headers: { "x-secret-key": secretKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        dispatchId,
        referenceId,
        status: "failed",
        deletedAt: new Date().toISOString(),
        dataTypes: [],
        remark: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      }),
    }).catch((e) => console.error("[DA] Postback failed:", e));
  }
}
