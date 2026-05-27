import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const doctor = await Doctor.findOne({ slug: id, isActive: true })
    .populate("department", "name slug")
    .lean();
  if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  return NextResponse.json({ doctor });
}
