import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import GrievanceTicket from "@/models/GrievanceTicket";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  category: z.enum(["data_access", "consent", "erasure", "breach", "other"]),
  description: z.string().min(20).max(2000),
});

// Section 13 – Grievance Redressal mechanism
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const ticketId = `GR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  const ticket = await GrievanceTicket.create({ ticketId, ...parsed.data });
  return NextResponse.json({ ticketId: ticket.ticketId }, { status: 201 });
}
