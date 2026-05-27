import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withAuth } from "@/lib/auth/middleware";
import { grantConsent } from "@/lib/consent/manager";

const schema = z.object({
  purposeId: z.string(),
  language: z.enum(["en", "hi"]).default("en"),
});

export const POST = withAuth(async (req: NextRequest, user) => {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const result = await grantConsent(user.userId, parsed.data.purposeId, {
      ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
      userAgent: req.headers.get("user-agent") ?? undefined,
      language: parsed.data.language,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to grant consent";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
});
