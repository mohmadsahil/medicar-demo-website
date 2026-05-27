import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { withAuth } from "@/lib/auth/middleware";

export const GET = withAuth(async (_req: NextRequest, user) => {
  await connectDB();
  const appointments = await Appointment.find({ userId: user.userId })
    .populate("doctorId", "name slug specialization image")
    .populate("departmentId", "name slug")
    .sort({ dateTime: -1 })
    .lean();
  return NextResponse.json({ appointments });
});
