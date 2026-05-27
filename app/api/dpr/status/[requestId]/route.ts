import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DataPrincipalRequest from "@/models/DataPrincipalRequest";
import { withAuth } from "@/lib/auth/middleware";

export const GET = withAuth(async (_req: NextRequest, user, context) => {
  await connectDB();
  const params = context?.params ? await context.params : {};
  const requestId = params.requestId;

  const request = await DataPrincipalRequest.findOne({
    _id: requestId,
    userId: user.userId,
  }).lean();

  if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });
  return NextResponse.json({ request });
});
