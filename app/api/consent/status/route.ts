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
    const serverKey = process.env.DA_SERVER_KEY ?? "";

    const response = await fetch(`${baseUrl}/api/v1/server/consent/${referenceId}`, {
      method: "GET",
      headers: {
        "x-server-key": serverKey,
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: (result as { message?: string }).message ?? "Failed to get status" },
        { status: response.status }
      );
    }

    const data = (result as { data?: Record<string, unknown> }).data ?? {};
    return NextResponse.json({
      success: true,
      data: {
        referenceId: data.referenceId,
        overallStatus: data.overallStatus,
        principal: data.principal,
        purposes: data.purposes,
        history: data.history,
      },
    });
  } catch (error) {
    console.error("[DA] Status error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
