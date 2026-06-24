import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { referenceId, purposeIds, reason } = await req.json();

    if (!referenceId) {
      return NextResponse.json({ success: false, error: "referenceId is required" }, { status: 400 });
    }

    const baseUrl = process.env.DA_BASE_URL ?? process.env.DIGITAL_ANUMATI_BASE_URL ?? "http://localhost:5001";
    const secretKey = process.env.DA_SECRET_KEY ?? process.env.DIGITAL_ANUMATI_API_KEY ?? "";

    const response = await fetch(`${baseUrl}/api/public/consents/action`, {
      method: "POST",
      headers: {
        "x-secret-key": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        referenceId,
        action: "revoked",
        purposeIds: purposeIds ?? [],
        reason: reason ?? "user_requested",
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: (result as { message?: string }).message ?? "Failed to revoke" },
        { status: response.status }
      );
    }

    const data = (result as { data?: Record<string, unknown> }).data ?? {};
    return NextResponse.json({
      success: true,
      message: "Consent revoked successfully.",
      data: {
        transactionId: data.transactionId,
        referenceId: data.referenceId,
        action: "revoked",
        affectedPurposes: data.affectedPurposes,
        performedAt: data.performedAt,
        webhookFired: data.webhookFired,
      },
    });
  } catch (error) {
    console.error("[DA] Revoke error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
