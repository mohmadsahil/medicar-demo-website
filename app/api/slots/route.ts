import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import Appointment from "@/models/Appointment";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");

  if (!doctorId || !date) {
    return NextResponse.json({ error: "doctorId and date required" }, { status: 400 });
  }

  await connectDB();
  const doctor = await Doctor.findOne({ slug: doctorId }).lean();
  if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });

  const day = new Date(date);
  const dayName = day.toLocaleDateString("en-US", { weekday: "long" });

  if (!doctor.availableDays.includes(dayName)) {
    return NextResponse.json({ slots: [], message: "Doctor not available on this day" });
  }

  const startOfDay = new Date(day.setHours(0, 0, 0, 0));
  const endOfDay = new Date(day.setHours(23, 59, 59, 999));

  const booked = await Appointment.find({
    doctorId: doctor._id,
    dateTime: { $gte: startOfDay, $lte: endOfDay },
    status: { $ne: "cancelled" },
  }).lean();

  const bookedTimes = new Set(booked.map((a) => new Date(a.dateTime).getHours()));
  const allSlots = [9, 10, 11, 14, 15, 16, 17];
  const slots = allSlots
    .filter((h) => !bookedTimes.has(h))
    .map((h) => `${h.toString().padStart(2, "0")}:00`);

  return NextResponse.json({ slots });
}
