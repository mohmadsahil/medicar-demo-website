import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import ComplaintTicket from "@/models/ComplaintTicket";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  department: z.string().min(1),
  category: z.enum(["staff_behaviour", "treatment_quality", "billing", "facility", "waiting_time", "food_amenities", "appointment", "other"]),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  description: z.string().min(20).max(2000),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const ticketId = `CMP-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  const ticket = await ComplaintTicket.create({ ticketId, ...parsed.data });
  return NextResponse.json({ ticketId: ticket.ticketId }, { status: 201 });
}
