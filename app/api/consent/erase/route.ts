import { NextRequest, NextResponse } from "next/server";
import { applyConsentFlag } from "@/lib/consentWebhook";

export async function POST(req: NextRequest) {
  try {
    const { referenceId } = await req.json();
    if (!referenceId?.trim()) {
      return NextResponse.json({ error: "referenceId is required." }, { status: 400 });
    }
    const found = await applyConsentFlag(referenceId.trim(), { consentErased: true });
    if (!found) return NextResponse.json({ error: "No record found for referenceId." }, { status: 404 });
    return NextResponse.json({ message: "onConsentErase applied." });
  } catch (err) {
    console.error("[consent/erase]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
