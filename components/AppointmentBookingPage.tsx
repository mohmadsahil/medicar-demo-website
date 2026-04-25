"use client";

import { FormEvent, useState } from "react";

type AppointmentForm = {
  patientName: string;
  doctorName: string;
  patientHistory: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  visitType: string;
  appointmentDateTime: string;
  department: string;
  medicalHistory: string;
  doctorNotes: string;
  allergies: string;
  prescriptions: string;
  preferredDoctor: string;
  consentLanguage: string;
  categories: {
    coreHealthcareServices: boolean;
    billingAndInsurance: boolean;
    communicationAndEngagement: boolean;
  };
};

const doctorOptions = [
  "Dr. R. Sharma",
  "Dr. A. Mehta",
  "Dr. P. Nair",
  "Dr. S. Verma",
  "Dr. K. Gupta",
];

const initialForm: AppointmentForm = {
  patientName: "",
  doctorName: "",
  patientHistory: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  visitType: "",
  appointmentDateTime: "",
  department: "",
  medicalHistory: "",
  doctorNotes: "",
  allergies: "",
  prescriptions: "",
  preferredDoctor: "",
  consentLanguage: "en",
  categories: {
    coreHealthcareServices: true,
    billingAndInsurance: true,
    communicationAndEngagement: false,
  },
};

export default function AppointmentBookingPage() {
  const [form, setForm] = useState<AppointmentForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function setField<K extends keyof AppointmentForm>(
    key: K,
    value: AppointmentForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const consentId = localStorage.getItem("da_consent_id") || undefined;
      if (!consentId) {
        setError(
          "Consent is required to book an appointment. Please provide consent first.",
        );
        return;
      }
      const res = await fetch("/api/demo-consent/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consentId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to book appointment.");
        return;
      }

      if (data?.referenceId) {
        (window as any).__CMP_CONFIG = {
          referenceId: data.referenceId,
        };
      }

      setSuccess("Appointment booked successfully.");
      setForm(initialForm);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to book appointment.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-gradient-to-b from-cyan-50 via-white to-slate-50">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-800 via-teal-700 to-emerald-700 text-white p-8 shadow-xl mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-100 mb-3">
            Hospital Demo
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Book Appointment
          </h1>
          <p className="mt-3 text-cyan-50">
            Fill in patient and appointment details to book a hospital demo
            appointment.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card space-y-6 border border-cyan-100 shadow-lg"
        >
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Appointment Booking Form
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Share patient details, doctor selection, and history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Patient Name *</label>
              <input
                className="form-input"
                value={form.patientName}
                onChange={(e) => setField("patientName", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Doctor Name *</label>
              <select
                className="form-input"
                value={form.doctorName}
                onChange={(e) => setField("doctorName", e.target.value)}
                required
              >
                <option value="">Select doctor</option>
                {doctorOptions.map((doctor) => (
                  <option key={doctor} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Date of Birth *</label>
              <input
                type="date"
                className="form-input"
                value={form.dateOfBirth}
                onChange={(e) => setField("dateOfBirth", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Gender *</label>
              <select
                className="form-input"
                value={form.gender}
                onChange={(e) => setField("gender", e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="form-label">Phone Number *</label>
              <input
                className="form-input"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Address *</label>
              <textarea
                className="form-input resize-none"
                rows={2}
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Visit Type *</label>
              <select
                className="form-input"
                value={form.visitType}
                onChange={(e) => setField("visitType", e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            <div>
              <label className="form-label">Appointment Date & Time *</label>
              <input
                type="datetime-local"
                className="form-input"
                value={form.appointmentDateTime}
                onChange={(e) =>
                  setField("appointmentDateTime", e.target.value)
                }
                required
              />
            </div>

            <div>
              <label className="form-label">Department *</label>
              <select
                className="form-input"
                value={form.department}
                onChange={(e) => setField("department", e.target.value)}
                required
              >
                <option value="">Select department</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Oncology">Oncology</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Patient History *</label>
              <textarea
                className="form-input resize-none"
                rows={3}
                value={form.patientHistory}
                onChange={(e) => setField("patientHistory", e.target.value)}
                placeholder="Past conditions, surgeries, chronic disease, and medication history"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Additional Notes</label>
              <textarea
                className="form-input resize-none"
                rows={2}
                value={form.doctorNotes}
                onChange={(e) => setField("doctorNotes", e.target.value)}
                placeholder="Optional appointment notes"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full md:w-auto disabled:opacity-60"
          >
            {saving ? "Booking appointment..." : "Book Appointment"}
          </button>
        </form>
      </section>
    </div>
  );
}
