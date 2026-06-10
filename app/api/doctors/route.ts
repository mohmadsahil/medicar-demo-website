import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import "@/models/Department";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const department = searchParams.get("department");
  const query = department ? { departmentSlug: department, isActive: true } : { isActive: true };
  const doctors = await Doctor.find(query).populate("department", "name slug").lean();
  return NextResponse.json({ doctors });
}
