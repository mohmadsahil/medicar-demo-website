import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";
import User from "@/models/User";
import { withAuth } from "@/lib/auth/middleware";
import { sendAppointmentConfirmationEmail } from "@/lib/email";

const schema = z.object({
  doctorSlug: z.string(),
  dateTime: z.string().datetime(),
  reason: z.string().min(5).max(500),
  consentReceiptId: z.string().optional(),
});

export const POST = withAuth(async (req: NextRequest, authUser) => {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const { doctorSlug, dateTime, reason, consentReceiptId } = parsed.data;

  const doctor = await Doctor.findOne({ slug: doctorSlug }).populate("department").lean();
  if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });

  const user = await User.findById(authUser.userId).lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const appointment = await Appointment.create({
    userId: authUser.userId,
    doctorId: doctor._id,
    departmentId: doctor.department,
    dateTime: new Date(dateTime),
    reason,
    consentReceiptId,
    status: "confirmed",
  });

  if (user.email) {
    const dept = doctor.department as unknown as { name: string } | null;
    sendAppointmentConfirmationEmail({
      name: user.name,
      email: user.email,
      appointment: {
        doctorName: doctor.name,
        department: dept?.name ?? doctor.departmentSlug,
        dateTime: new Date(dateTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        location: `${process.env.HOSPITAL_NAME ?? "MediCare Plus"} — OPD Floor 2`,
        appointmentId: appointment._id.toString(),
        consentReceiptId,
      },
    }).catch(console.error);
  }

  return NextResponse.json({ appointment }, { status: 201 });
});
