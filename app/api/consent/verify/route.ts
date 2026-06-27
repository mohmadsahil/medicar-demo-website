import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let { transactionId, referenceId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: "transactionId is required" },
        { status: 400 }
      );
    }

    // 1. If referenceId is missing, check if user is authenticated or generate a new one
    if (!referenceId) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        try {
          const token = authHeader.slice(7);
          const payload = verifyAccessToken(token);
          if (payload?.userId) {
            await connectDB();
            const user = await User.findById(payload.userId);
            if (user) {
              if (user.referenceId?.startsWith("DA-REF-")) {
                referenceId = user.referenceId;
              } else {
                referenceId = `DA-REF-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
                await User.findByIdAndUpdate(user._id, { referenceId });
              }
            }
          }
        } catch (e) {
          console.error("[DA] Auth verification failed during auto-reference generation:", e);
        }
      }

      // If still no referenceId (anonymous user / contact form / unregistered)
      if (!referenceId) {
        referenceId = `DA-REF-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
      }
    }

    const baseUrl = process.env.DA_BASE_URL ?? process.env.DIGITAL_ANUMATI_BASE_URL ?? "http://localhost:5001";
    const secretKey = process.env.DA_SECRET_KEY ?? process.env.DIGITAL_ANUMATI_API_KEY ?? "";

    // 2. Call the working backend verification API (singular transaction/verify)
    const response = await fetch(`${baseUrl}/api/v1/server/transaction/verify`, {
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
      referenceId: referenceId, // Return the referenceId that was actually used/generated
      consentKey: data.consentKey,
      expiresAt: data.expiresAt,
      purposes: data.purposes,
    });
  } catch (error) {
    console.error("[DA] Verify error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
