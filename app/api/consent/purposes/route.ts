import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ConsentPurpose from "@/models/ConsentPurpose";

export async function GET() {
  await connectDB();
  const purposes = await ConsentPurpose.find({ isActive: true }).lean();
  return NextResponse.json({ purposes });
}
