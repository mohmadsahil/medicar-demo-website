import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { getConsentHistory } from "@/lib/consent/manager";

export const GET = withAuth(async (_req: NextRequest, user) => {
  const history = await getConsentHistory(user.userId);
  return NextResponse.json({ history });
});
