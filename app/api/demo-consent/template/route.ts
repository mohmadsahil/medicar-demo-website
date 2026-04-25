import { NextResponse } from "next/server";
import { hospitalConsentTemplate } from "@/lib/hospitalConsentTemplate";

export async function GET() {
  return NextResponse.json({ template: hospitalConsentTemplate });
}
