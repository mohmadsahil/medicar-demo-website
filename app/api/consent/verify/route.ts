import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, referenceId } = body;

    if (!transactionId || !referenceId) {
      return NextResponse.json(
        { success: false, error: "transactionId and referenceId are required" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.DA_BASE_URL ?? process.env.DIGITAL_ANUMATI_BASE_URL ?? "http://localhost:5001";
    const secretKey = process.env.DA_SECRET_KEY ?? process.env.DIGITAL_ANUMATI_API_KEY ?? "";

    const response = await fetch(`${baseUrl}/api/v1/server/app/consents/verify`, {
      method: "POST",
      headers: {
        "x-secret-key": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactionId, referenceId }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !(result as Record<string, unknown>).data || !(result as { data?: { valid?: boolean } }).data?.valid) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          reason: (result as { data?: { reason?: string } }).data?.reason ?? "invalid",
          error: (result as { message?: string }).message ?? "Consent verification failed",
        },
        { status: 403 }
      );
    }

    const data = (result as { data: Record<string, unknown> }).data;
    return NextResponse.json({
      success: true,
      valid: true,
      transactionId: data.transactionId,
      referenceId: data.referenceId,
      consentKey: data.consentKey,
      expiresAt: data.expiresAt,
      purposes: data.purposes,
    });
  } catch (error) {
    console.error("[DA] Verify error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
