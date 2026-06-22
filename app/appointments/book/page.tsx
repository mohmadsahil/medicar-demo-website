"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, Clock, User, CheckCircle, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Doctor {
  _id: string;
  name: string;
  slug: string;
  specialization: string;
  department: { name: string };
}

const STATIC_DOCTORS: Doctor[] = [
  {
    _id: "1",
    name: "Aarav Sharma",
    slug: "aarav-sharma",
    specialization: "Cardiologist",
    department: { name: "Cardiology" },
  },
  {
    _id: "2",
    name: "Priya Patel",
    slug: "priya-patel",
    specialization: "Dermatologist",
    department: { name: "Dermatology" },
  },
  {
    _id: "3",
    name: "Rohan Mehta",
    slug: "rohan-mehta",
    specialization: "Neurologist",
    department: { name: "Neurology" },
  },
  {
    _id: "4",
    name: "Ananya Iyer",
    slug: "ananya-iyer",
    specialization: "Pediatrician",
    department: { name: "Pediatrics" },
  },
  {
    _id: "5",
    name: "Vikram Singh",
    slug: "vikram-singh",
    specialization: "Orthopedic Surgeon",
    department: { name: "Orthopedics" },
  },
  {
    _id: "6",
    name: "Neha Kapoor",
    slug: "neha-kapoor",
    specialization: "General Physician",
    department: { name: "General Medicine" },
  },
];

const STATIC_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

function BookAppointmentContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedDoctor = searchParams.get("doctor");

  const [doctors] = useState<Doctor[]>(STATIC_DOCTORS);
  const [form, setForm] = useState({
    doctorSlug: preselectedDoctor ?? "",
    date: "",
    time: "",
    reason: "",
  });
  const [slots, setSlots] = useState<string[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace(`/auth/login?redirect=/appointments/book`);
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!form.doctorSlug || !form.date) {
      setSlots([]);
      return;
    }
    setSlots(STATIC_SLOTS);
  }, [form.doctorSlug, form.date]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.doctorSlug || !form.date || !form.time || !form.reason) {
      setError("All fields are required");
      return;
    }
    setBookingLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));
    setBookingLoading(false);
    setSuccess(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (success)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Appointment Confirmed!
          </h2>
          <p className="text-gray-500 text-sm mb-2">
            A confirmation email has been sent to you.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Check your inbox for appointment details and pre-visit instructions.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/portal")}
              className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700"
            >
              Go to Portal
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setForm({ doctorSlug: "", date: "", time: "", reason: "" });
              }}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    );

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Book Appointment
          </h1>
          <p className="text-gray-500 text-sm">
            Schedule a consultation with our specialists
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5"
        >
          {/* Doctor selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <User size={14} /> Select Doctor
            </label>
            <select
              required
              value={form.doctorSlug}
              onChange={(e) =>
                setForm({ ...form, doctorSlug: e.target.value, time: "" })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">Choose a doctor...</option>
              {doctors.map((d) => (
                <option key={d.slug} value={d.slug}>
                  Dr. {d.name} — {d.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Calendar size={14} /> Preferred Date
            </label>
            <input
              type="date"
              required
              min={today}
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value, time: "" })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* Time slots */}
          {form.date && form.doctorSlug && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                <Clock size={14} /> Available Time Slots
              </label>
              {slots.length === 0 ? (
                <div className="text-sm text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-xl">
                  No slots available for this date
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setForm({ ...form, time: slot })}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                        form.time === slot
                          ? "bg-sky-600 text-white border-sky-600"
                          : "border-gray-200 text-gray-700 hover:border-sky-300"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Reason for Visit
            </label>
            <textarea
              required
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Briefly describe your symptoms or reason for consultation..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 resize-none"
            />
          </div>

          {/* Consent notice */}
          <div className="bg-sky-50 rounded-xl p-4 flex gap-2.5 text-xs text-sky-800">
            <Shield size={14} className="text-sky-600 shrink-0 mt-0.5" />
            <span>
              By booking, you consent to the collection and processing of your
              appointment data under your existing consent preferences.{" "}
              <a href="/consent/dashboard" className="underline">
                Manage consents
              </a>
            </span>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={bookingLoading}
            className="w-full bg-sky-600 text-white py-3.5 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
          >
            {bookingLoading ? "Booking..." : "Confirm Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Loading...
        </div>
      }
    >
      <BookAppointmentContent />
    </Suspense>
  );
}
