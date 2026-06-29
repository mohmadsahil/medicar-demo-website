import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const event = await req.json().catch(() => null);
  if (!event) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const eventType = (event.type || event.event) as string;
  const referenceId = (event.data?.referenceId || event.referenceId) as string;

  console.log("[DA webhook]", eventType, referenceId);
  processEvent(event).catch((e) => console.error("[DA webhook] processEvent failed:", e));
  return NextResponse.json({ received: true });
}

async function processEvent(event: Record<string, any>) {
  const eventType = (event.type || event.event) as string;
  const dispatchId = (event.metadata?.dispatchId || event.dispatchId || event.id) as string;
  const referenceId = (event.data?.referenceId || event.referenceId) as string;
  const consentId = (event.data?.consentId || event.consentId) as string;
  const purposeId = (event.data?.purpose?.id || event.purposeId) as string;

  console.log("[DA webhook details]", { eventType, dispatchId, referenceId, consentId, purposeId });

  if (eventType === "consent.withdrawn" || eventType === "data.deleted") {
    console.log("[DA webhook] Delaying postback for 60 seconds to showcase pending status in Developer Dashboard...");
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }

  if (eventType === "consent.withdrawn") {
    await handleConsentWithdrawn(dispatchId, referenceId, consentId || purposeId);
  } else if (eventType === "data.deleted") {
    await handleDataDeleted(dispatchId, referenceId, consentId || purposeId);
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

async function handleConsentWithdrawn(dispatchId: string, referenceId: string, targetId: string) {
  const baseUrl = process.env.DIGITAL_ANUMATI_BASE_URL ?? "http://localhost:5001";
  const secretKey = process.env.DIGITAL_ANUMATI_API_KEY ?? "";

  try {
    console.log("[DA] Processing withdrawal for", referenceId);

    // YOUR BUSINESS LOGIC HERE:
    // await unsubscribeFromEmails(referenceId)
    // await updateCRM(referenceId, 'withdrawn')
    // await stopScheduledJobs(referenceId)

    const res = await fetch(`${baseUrl}/api/v1/server/consent/action`, {
      method: "POST",
      headers: {
        "x-secret-key": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dispatchId,
        referenceId,
        action: "withdraw",
        purposeIds: targetId ? [targetId] : [],
        reason: "Withdrawn via demo-web webhook confirmation",
        performedBy: "demo_web_app",
      }),
    });

    const result = await res.json().catch(() => ({}));
    console.log("[DA] Withdrawal confirmed:", (result as Record<string, unknown>)?.data);
  } catch (error) {
    console.error("[DA] Failed to process withdrawal:", error);
  }
}

async function handleDataDeleted(dispatchId: string, referenceId: string, targetId: string) {
  const baseUrl = process.env.DIGITAL_ANUMATI_BASE_URL ?? "http://localhost:5001";
  const secretKey = process.env.DIGITAL_ANUMATI_API_KEY ?? "";

  try {
    console.log("[DA] Processing data deletion for", referenceId);

    // YOUR BUSINESS LOGIC HERE:
    // await deleteBookingRecords(referenceId)
    // await deleteHealthData(referenceId)
    // await anonymiseContactInfo(referenceId)

    const res = await fetch(`${baseUrl}/api/v1/server/consent/action`, {
      method: "POST",
      headers: {
        "x-secret-key": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dispatchId,
        referenceId,
        action: "erase",
        purposeIds: targetId ? [targetId] : [],
        reason: "Erased via demo-web webhook confirmation",
        performedBy: "demo_web_app",
      }),
    });

    const result = await res.json().catch(() => ({}));
    console.log("[DA] Deletion confirmed:", (result as Record<string, unknown>)?.data);
  } catch (error) {
    console.error("[DA] Failed to process deletion:", error);
  }
}
