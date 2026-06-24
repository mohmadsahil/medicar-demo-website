import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ transactionId: string }> }
) {
  try {
    const params = await context.params;
    const { transactionId } = params;

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: "transactionId is required" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.DA_BASE_URL ?? process.env.DIGITAL_ANUMATI_BASE_URL ?? "http://localhost:5001";
    const secretKey = process.env.DA_SECRET_KEY ?? process.env.DIGITAL_ANUMATI_API_KEY ?? "";

    const response = await fetch(
      `${baseUrl}/api/public/consents/transactions/${transactionId}`,
      {
        method: "GET",
        headers: {
          "x-secret-key": secretKey,
        },
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: (result as { message?: string }).message ?? "Failed to get transaction" },
        { status: response.status }
      );
    }

    const data = (result as { data?: Record<string, unknown> }).data ?? {};
    return NextResponse.json({
      success: true,
      data: {
        transactionId: data.transactionId,
        referenceId: data.referenceId,
        consentKey: data.consentKey,
        status: data.status,
        noticeType: data.noticeType,
        capturedAt: data.capturedAt,
        expiresAt: data.expiresAt,
        records: data.records,
        activity: data.activity,
      },
    });
  } catch (error) {
    console.error("[DA] Transaction detail error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
