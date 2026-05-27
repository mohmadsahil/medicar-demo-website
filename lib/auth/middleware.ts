import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, AccessTokenPayload } from "./jwt";

type RouteContext = { params: Promise<Record<string, string>> };

export function withAuth(
  handler: (req: NextRequest, user: AccessTokenPayload, context?: RouteContext) => Promise<NextResponse>,
  options: { roles?: string[] } = {}
) {
  return async (req: NextRequest, context?: RouteContext) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    try {
      const payload = verifyAccessToken(token);
      if (options.roles && !options.roles.includes(payload.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return handler(req, payload, context);
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
  };
}
