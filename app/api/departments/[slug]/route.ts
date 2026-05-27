import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Department from "@/models/Department";
import Doctor from "@/models/Doctor";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await params;
  const [department, doctors] = await Promise.all([
    Department.findOne({ slug, isActive: true }).lean(),
    Doctor.find({ departmentSlug: slug, isActive: true }).lean(),
  ]);
  if (!department) return NextResponse.json({ error: "Department not found" }, { status: 404 });
  return NextResponse.json({ department, doctors });
}
