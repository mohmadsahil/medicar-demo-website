"use client";
import { useState } from "react";
import { MessageSquareWarning, Send, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";

type Category = "staff_behaviour" | "treatment_quality" | "billing" | "facility" | "waiting_time" | "food_amenities" | "appointment" | "other";
type Priority = "low" | "medium" | "high";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "staff_behaviour", label: "Doctor / Staff Behaviour" },
  { value: "treatment_quality", label: "Treatment Quality" },
  { value: "billing", label: "Billing & Payment Issues" },
  { value: "facility", label: "Facility & Cleanliness" },
  { value: "waiting_time", label: "Waiting Time" },
  { value: "food_amenities", label: "Food & Amenities" },
  { value: "appointment", label: "Appointment Issues" },
  { value: "other", label: "Other" },
];

const DEPARTMENTS = [
  "Emergency",
  "OPD (General)",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Oncology",
  "Pediatrics",
  "Obstetrics & Gynecology",
  "Radiology",
  "Pathology / Lab",
  "Pharmacy",
  "Billing & Accounts",
  "Housekeeping",
  "ICU / CCU",
  "Other",
];

const PRIORITY_CONFIG: Record<Priority, { label: string; cls: string }> = {
  low: { label: "Low", cls: "border-gray-300 text-gray-600" },
  medium: { label: "Medium", cls: "border-amber-400 text-amber-700" },
  high: { label: "High — Urgent", cls: "border-red-400 text-red-600" },
};

export default function ComplaintsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    category: "" as Category | "",
    priority: "medium" as Priority,
    description: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [ticketId, setTicketId] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setTicketId(data.ticketId);
      setStatus("sent");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-sky-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquareWarning size={26} />
            <h1 className="text-3xl font-bold">Patient Complaint Portal</h1>
          </div>
          <p className="text-sky-200 text-sm">
            Share your feedback to help us improve. Every complaint is reviewed by our Quality Assurance team.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Contact Quality Team</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-sky-600 shrink-0" />
                  <span>+91-22-4567-8900 (Ext. 200)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-sky-600 shrink-0" />
                  <span>complaints@medicareplus.in</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-sky-600 shrink-0" />
                  <span>Mon–Sat, 9 AM – 6 PM</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Resolution Timeline</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Acknowledgement</span>
                  <span className="font-medium text-gray-900">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">High priority</span>
                  <span className="font-medium text-red-600">3 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Medium priority</span>
                  <span className="font-medium text-amber-600">7 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Low priority</span>
                  <span className="font-medium text-gray-900">15 days</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-sm text-amber-800">
              <strong className="block mb-1">Medical Emergency?</strong>
              Call <strong>102</strong> or visit the Emergency department directly. Do not use this form for emergencies.
            </div>
          </div>

          {/* Main form / success */}
          <div className="lg:col-span-2">
            {status === "sent" ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <CheckCircle2 size={52} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Complaint Registered</h2>
                <div className="text-sky-600 font-mono text-lg font-bold mb-3">{ticketId}</div>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Your complaint has been received. Our Quality Assurance team will review it and respond to your email within the resolution timeline.
                </p>
                <button
                  onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", department: "", category: "", priority: "medium", description: "" }); }}
                  className="mt-6 text-sky-600 text-sm font-medium hover:underline"
                >
                  Submit another complaint
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-8">
                <form onSubmit={submit} className="space-y-5">
                  {/* Personal info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (optional)</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>

                  {/* Department & category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Department *</label>
                      <select
                        required
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      >
                        <option value="">Select department...</option>
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Complaint Category *</label>
                      <select
                        required
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      >
                        <option value="">Select category...</option>
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <div className="flex gap-3">
                      {(["low", "medium", "high"] as Priority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setForm({ ...form, priority: p })}
                          className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-colors ${form.priority === p ? PRIORITY_CONFIG[p].cls + " bg-opacity-10" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                        >
                          {PRIORITY_CONFIG[p].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description * <span className="text-gray-400 font-normal">(min 20 characters)</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      minLength={20}
                      maxLength={2000}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Please describe the issue in detail — include date, time, and staff/doctor name if applicable..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 resize-none"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{form.description.length}/2000</div>
                  </div>

                  {status === "error" && (
                    <div className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error || "Something went wrong. Please try again."}</div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
                  >
                    <Send size={16} />
                    {status === "sending" ? "Submitting..." : "Submit Complaint"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
