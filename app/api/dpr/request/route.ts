import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import DataPrincipalRequest from "@/models/DataPrincipalRequest";
import { withAuth } from "@/lib/auth/middleware";

const schema = z.object({
  requestType: z.enum(["access", "correction", "erasure", "portability", "nomination"]),
  description: z.string().min(10).max(2000),
});

// Section 11/12/13/14 – Data Principal Rights
export const POST = withAuth(async (req: NextRequest, user) => {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const dueDate = new Date(Date.now() + 30 * 86400 * 1000); // 30-day statutory timeline

  const request = await DataPrincipalRequest.create({
    userId: user.userId,
    ...parsed.data,
    dueDate,
  });

  return NextResponse.json({ request }, { status: 201 });
});
