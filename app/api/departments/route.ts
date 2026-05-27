import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Department from "@/models/Department";

export async function GET() {
  await connectDB();
  const departments = await Department.find({ isActive: true }).lean();
  return NextResponse.json({ departments });
}
