import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HospitalConsentSubmission from "@/models/HospitalConsentSubmission";

export async function GET() {
  try {
    await connectDB();
    const records = await HospitalConsentSubmission.find()
      .sort({ createdAt: -1 })
      .limit(25)
      .select(
        "patientName doctorName email department appointmentDateTime categories consentLanguage consentStatus createdAt",
      )
      .lean();

    return NextResponse.json({ records });
  } catch (error) {
    console.error("[demo-consent/records]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
