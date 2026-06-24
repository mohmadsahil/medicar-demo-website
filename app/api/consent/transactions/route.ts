import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const referenceId = req.nextUrl.searchParams.get("referenceId");

    if (!referenceId) {
      return NextResponse.json(
        { success: false, error: "referenceId query param is required" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.DA_BASE_URL ?? process.env.DIGITAL_ANUMATI_BASE_URL ?? "http://localhost:5001";
    const secretKey = process.env.DA_SECRET_KEY ?? process.env.DIGITAL_ANUMATI_API_KEY ?? "";

    const response = await fetch(`${baseUrl}/api/public/consents/${referenceId}/transactions`, {
      method: "GET",
      headers: {
        "x-secret-key": secretKey,
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: (result as { message?: string }).message ?? "Failed to get transactions" },
        { status: response.status }
      );
    }

    const data = (result as { data?: Record<string, unknown> }).data ?? {};
    return NextResponse.json({
      success: true,
      data: {
        referenceId: data.referenceId,
        principal: data.principal,
        transactions: data.transactions,
      },
    });
  } catch (error) {
    console.error("[DA] Transactions error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
