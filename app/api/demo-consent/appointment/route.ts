import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HospitalConsentSubmission from "@/models/HospitalConsentSubmission";
import User from "@/models/User";
import { hospitalConsentTemplate } from "@/lib/hospitalConsentTemplate";
import { verifyDigitalAnumatiConsent } from "@/lib/digitalAnumati";
import { sendConsentRevokeEmail } from "@/lib/email";
import { getAuthUser } from "@/lib/auth";

interface AppointmentRequest {
  patientName: string;
  doctorName: string;
  patientHistory: string;
  dateOfBirth: string;
  gender: string;
  patientId?: string;
  phone: string;
  email: string;
  address: string;
  doctorNotes?: string;
  prescriptions?: string;
  allergies?: string;
  medicalHistory?: string;
  visitType: string;
  appointmentDateTime: string;
  department: string;
  preferredDoctor?: string;
  billingAddress?: string;
  transactionDetails?: string;
  paymentMethod?: string;
  insuranceProvider?: string;
  coverageDetails?: string;
  policyNumber?: string;
  consentId?: string;
  categories: {
    coreHealthcareServices: boolean;
    billingAndInsurance: boolean;
    communicationAndEngagement: boolean;
  };
  consentLanguage?: string;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string): boolean {
  return /^\+?[\d\s\-()]{7,20}$/.test(value);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AppointmentRequest;

    const requiredFields: Array<keyof AppointmentRequest> = [
      "patientName",
      "doctorName",
      "patientHistory",
      "dateOfBirth",
      "gender",
      "phone",
      "email",
      "address",
      "visitType",
      "appointmentDateTime",
      "department",
    ];

    for (const field of requiredFields) {
      const value = body[field];
      if (typeof value !== "string" || !value.trim()) {
        return NextResponse.json(
          { error: `${field} is required.` },
          { status: 400 },
        );
      }
    }

    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    if (!isValidPhone(body.phone)) {
      return NextResponse.json(
        { error: "Invalid phone number." },
        { status: 400 },
      );
    }

    const categories = {
      coreHealthcareServices: body.categories?.coreHealthcareServices ?? true,
      billingAndInsurance: body.categories?.billingAndInsurance ?? true,
      communicationAndEngagement:
        body.categories?.communicationAndEngagement ?? false,
    };

    let revokeUrl: string | undefined;
    let consentUserId: string | undefined;
    let consentRecordId: string | undefined;
    let referenceId: string | undefined;

    await connectDB();

    const authUser = await getAuthUser();
    const loggedInUser = authUser?.userId
      ? await User.findById(authUser.userId)
      : null;

    if (body.consentId?.trim()) {
      try {
        if (loggedInUser?.referenceId) {
          referenceId = loggedInUser.referenceId;
        } else {
          referenceId = `${crypto.randomUUID()}${Date.now()}`;
        }

        const consentResponse = await verifyDigitalAnumatiConsent(
          body.consentId.trim(),
          referenceId,
          body.email.toLowerCase().trim(),
        );
        console.log(
          "[demo-consent/appointment] verifyDigitalAnumatiConsent",
          consentResponse,
        );
        revokeUrl = consentResponse?.data?.revokeUrl;
        consentUserId = consentResponse?.data?.userId;
        consentRecordId = consentResponse?.data?.consentRecordId;

        if (loggedInUser && !loggedInUser.referenceId) {
          await User.findByIdAndUpdate(loggedInUser._id, { referenceId });
        }
      } catch (err) {
        console.error(
          "[demo-consent/appointment] consent verify failed (non-blocking):",
          err,
        );
      }
    }
    const record = await HospitalConsentSubmission.create({
      ...body,
      patientName: body.patientName.trim(),
      doctorName: body.doctorName.trim(),
      patientHistory: body.patientHistory.trim(),
      dateOfBirth: body.dateOfBirth.trim(),
      gender: body.gender.trim(),
      patientId: body.patientId?.trim() || "",
      phone: body.phone.trim(),
      email: body.email.toLowerCase().trim(),
      address: body.address.trim(),
      doctorNotes: body.doctorNotes?.trim() || "",
      prescriptions: body.prescriptions?.trim() || "",
      allergies: body.allergies?.trim() || "",
      medicalHistory: body.medicalHistory?.trim() || "",
      visitType: body.visitType.trim(),
      appointmentDateTime: body.appointmentDateTime.trim(),
      department: body.department.trim(),
      preferredDoctor: body.preferredDoctor?.trim() || "",
      billingAddress: body.billingAddress?.trim() || "NA",
      transactionDetails: body.transactionDetails?.trim() || "NA",
      paymentMethod: body.paymentMethod?.trim() || "NA",
      insuranceProvider: body.insuranceProvider?.trim() || "NA",
      coverageDetails: body.coverageDetails?.trim() || "NA",
      policyNumber: body.policyNumber?.trim() || "NA",
      consentId: body.consentId?.trim(),
      consentUserId,
      consentRecordId,
      referenceId,
      revokeUrl,
      categories,
      consentLanguage: body.consentLanguage?.trim() || "en",
      consentTemplateId: hospitalConsentTemplate.id,
      consentVersion: hospitalConsentTemplate.version,
      consentStatus: "granted",
    });

    if (revokeUrl) {
      Promise.resolve()
        .then(() =>
          sendConsentRevokeEmail(
            {
              name: body.patientName.trim(),
              email: body.email.toLowerCase().trim(),
            },
            revokeUrl!,
          ),
        )
        .catch((err) =>
          console.error(
            "[demo-consent/appointment] revoke email failed:",
            err?.message ?? err,
          ),
        );
    }

    return NextResponse.json(
      {
        message: "Appointment request and consent recorded successfully.",
        recordId: record._id,
        consentTemplateId: hospitalConsentTemplate.id,
        consentVersion: hospitalConsentTemplate.version,
        referenceId,
        revokeUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[demo-consent/appointment]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
