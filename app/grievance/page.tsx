"use client";
import { useState } from "react";
import { AlertCircle, Send, Shield } from "lucide-react";

export default function GrievancePage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", category: "", description: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [ticketId, setTicketId] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setTicketId(data.ticketId);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-sky-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle size={26} />
            <h1 className="text-3xl font-bold">Grievance Portal</h1>
          </div>
          <p className="text-sky-200 text-sm">Data Principal Grievance Redressal — DPDP Act 2023, Section 13</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {status === "sent" ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Grievance Registered</h2>
            <div className="text-sky-600 font-mono text-lg font-bold mb-3">{ticketId}</div>
            <p className="text-gray-500 text-sm">Your grievance has been registered. Our DPO will respond within 30 days as required under Section 13 of the DPDP Act 2023.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mb-6 flex gap-2.5 text-sm text-sky-800">
              <Shield size={16} className="shrink-0 mt-0.5" />
              <div>Under the DPDP Act 2023 (Section 13), you have the right to raise a grievance about the processing of your personal data. We are required to respond within 30 days.</div>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Grievance Category *</label>
                <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
                  <option value="">Select category...</option>
                  <option value="data_access">Data Access Request (Section 11)</option>
                  <option value="consent">Consent Management Issue (Section 6)</option>
                  <option value="erasure">Data Erasure Request (Section 13)</option>
                  <option value="breach">Data Breach or Unauthorized Access</option>
                  <option value="other">Other Privacy Concern</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea required rows={5} minLength={20} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Please describe your grievance in detail..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 resize-none" />
              </div>
              {status === "error" && <div className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">Something went wrong. Please try again.</div>}
              <button type="submit" disabled={status === "sending"} className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
                <Send size={16} /> {status === "sending" ? "Submitting..." : "Submit Grievance"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
