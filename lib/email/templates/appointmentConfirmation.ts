import { baseLayout, ctaButton, infoCard } from "./base";
import type { AppointmentEmailPayload } from "../types";

const baseUrl = process.env.NEXTAUTH_URL ?? "https://medicare.example";

export function appointmentConfirmationTemplate(payload: AppointmentEmailPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const { name, appointment } = payload;
  const { doctorName, department, dateTime, location, appointmentId, consentReceiptId } = appointment;

  const body = `
    <div style="background:#dcfce7;border:1px solid #86efac;border-radius:8px;padding:16px;margin-bottom:24px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:24px;">✅</span>
      <div>
        <div style="font-size:16px;font-weight:700;color:#15803d;">Appointment Confirmed!</div>
        <div style="font-size:13px;color:#166534;">Booking ID: ${appointmentId}</div>
      </div>
    </div>
    <p style="font-size:16px;color:#1e293b;">Dear ${name},</p>
    <p style="font-size:15px;color:#334155;">Your appointment has been successfully scheduled. Here are your details:</p>
    ${infoCard([
      { label: "Doctor", value: `Dr. ${doctorName}` },
      { label: "Department", value: department },
      { label: "Date & Time", value: dateTime },
      { label: "Location", value: location },
      { label: "Booking ID", value: appointmentId },
      ...(consentReceiptId ? [{ label: "Consent Receipt", value: consentReceiptId }] : []),
    ])}
    <div style="text-align:center;">
      ${ctaButton("View My Appointments", `${baseUrl}/portal`)}
      &nbsp;&nbsp;
      ${ctaButton("Reschedule / Cancel", `${baseUrl}/portal`, "#64748b")}
    </div>
    <div style="margin-top:24px;background:#f0f9ff;border-radius:8px;padding:16px;">
      <div style="font-size:14px;font-weight:600;color:#0369a1;margin-bottom:8px;">Pre-Visit Instructions</div>
      <ul style="font-size:13px;color:#334155;margin:0;padding-left:20px;line-height:1.8;">
        <li>Please arrive 15 minutes before your appointment time</li>
        <li>Bring a valid photo ID and any previous medical records</li>
        <li>If you need to cancel, please do so at least 24 hours in advance</li>
        <li>Wear comfortable clothing suitable for examination</li>
      </ul>
    </div>
    ${consentReceiptId ? `<p style="font-size:12px;color:#94a3b8;margin-top:16px;">This appointment is linked to consent receipt <strong>${consentReceiptId}</strong>. <a href="${baseUrl}/consent/dashboard" style="color:#0ea5e9;">Manage your consents</a></p>` : ""}
  `;

  return {
    subject: `Appointment confirmed with Dr. ${doctorName} on ${dateTime}`,
    html: baseLayout(body),
    text: `Appointment Confirmed\n\nDear ${name},\nDoctor: Dr. ${doctorName}\nDepartment: ${department}\nDate & Time: ${dateTime}\nLocation: ${location}\nBooking ID: ${appointmentId}`,
  };
}

export function appointmentReminderTemplate(payload: AppointmentEmailPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const { name, appointment } = payload;
  const { doctorName, department, dateTime, location, appointmentId } = appointment;

  const body = `
    <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:16px;margin-bottom:24px;">
      <div style="font-size:16px;font-weight:700;color:#92400e;">⏰ Appointment Reminder</div>
      <div style="font-size:13px;color:#78350f;">Your appointment is tomorrow</div>
    </div>
    <p style="font-size:16px;color:#1e293b;">Dear ${name},</p>
    <p style="font-size:15px;color:#334155;">This is a friendly reminder about your upcoming appointment:</p>
    ${infoCard([
      { label: "Doctor", value: `Dr. ${doctorName}` },
      { label: "Department", value: department },
      { label: "Date & Time", value: dateTime },
      { label: "Location", value: location },
      { label: "Booking ID", value: appointmentId },
    ])}
    <div style="text-align:center;">
      ${ctaButton("View Appointment", `${baseUrl}/portal`)}
    </div>
    <p style="font-size:13px;color:#64748b;margin-top:16px;">Need to cancel? Please do so at least 2 hours before your appointment to avoid a no-show fee.</p>
  `;

  return {
    subject: `Reminder: Appointment with Dr. ${doctorName} tomorrow`,
    html: baseLayout(body),
    text: `Appointment Reminder — Tomorrow\nDoctor: Dr. ${doctorName} | ${dateTime} | ${location}`,
  };
}

export function appointmentCancelledTemplate(
  payload: AppointmentEmailPayload & { cancellationReason?: string }
): { subject: string; html: string; text: string } {
  const { name, appointment, cancellationReason } = payload;
  const { doctorName, dateTime, appointmentId } = appointment;

  const body = `
    <div style="background:#fee2e2;border:1px solid #fca5a5;border-radius:8px;padding:16px;margin-bottom:24px;">
      <div style="font-size:16px;font-weight:700;color:#991b1b;">❌ Appointment Cancelled</div>
    </div>
    <p style="font-size:16px;color:#1e293b;">Dear ${name},</p>
    <p style="font-size:15px;color:#334155;">Your appointment has been cancelled.</p>
    ${infoCard([
      { label: "Doctor", value: `Dr. ${doctorName}` },
      { label: "Date & Time", value: dateTime },
      { label: "Booking ID", value: appointmentId },
      ...(cancellationReason ? [{ label: "Reason", value: cancellationReason }] : []),
    ])}
    <div style="text-align:center;">
      ${ctaButton("Book New Appointment", `${baseUrl}/appointments/book`)}
    </div>
  `;

  return {
    subject: `Appointment Cancelled — Dr. ${doctorName} on ${dateTime}`,
    html: baseLayout(body),
    text: `Your appointment with Dr. ${doctorName} on ${dateTime} (ID: ${appointmentId}) has been cancelled.`,
  };
}
