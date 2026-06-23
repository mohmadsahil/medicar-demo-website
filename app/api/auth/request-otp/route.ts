import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requestOtp } from "@/lib/auth/otp";

const schema = z.object({
  identifier: z.string().min(1),
  identifierType: z.enum(["email", "phone"]),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { identifier, identifierType } = parsed.data;

  if (identifierType === "phone" && !/^[6-9]\d{9}$/.test(identifier)) {
    return NextResponse.json({ error: "Invalid Indian phone number" }, { status: 400 });
  }
  if (identifierType === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    const result = await requestOtp(identifier, identifierType);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 429 });
    }
    return NextResponse.json({ message: result.message });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    const isDbError = message.includes("ECONNREFUSED") || message.includes("querySrv") || message.includes("MONGODB_URI");
    return NextResponse.json(
      { error: isDbError ? "Database unavailable. Please try again later." : message },
      { status: isDbError ? 503 : 500 }
    );
  }
}
