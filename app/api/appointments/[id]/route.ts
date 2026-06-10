import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { withAuth } from "@/lib/auth/middleware";

export const DELETE = withAuth(async (req: NextRequest, user, context) => {
  await connectDB();
  const params = context?.params ? await context.params : {};
  const id = params.id;
  const body = await req.json().catch(() => ({}));

  const appointment = await Appointment.findOne({ _id: id, userId: user.userId });
  if (!appointment) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });

  appointment.status = "cancelled";
  appointment.cancellationReason = body.reason ?? "Cancelled by patient";
  await appointment.save();

  return NextResponse.json({ message: "Appointment cancelled" });
});
