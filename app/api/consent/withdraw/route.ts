import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withAuth } from "@/lib/auth/middleware";
import { withdrawConsent } from "@/lib/consent/manager";

const schema = z.object({ purposeId: z.string() });

// Section 6(4) – Withdrawal must be as easy as giving consent
export const POST = withAuth(async (req: NextRequest, user) => {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const result = await withdrawConsent(user.userId, parsed.data.purposeId, {
      ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });
    return NextResponse.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to withdraw consent";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
});
