import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { getUserConsents } from "@/lib/consent/manager";

export const GET = withAuth(async (_req: NextRequest, user) => {
  const consents = await getUserConsents(user.userId);
  return NextResponse.json({ consents });
});
