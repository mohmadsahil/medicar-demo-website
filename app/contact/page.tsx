"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      localStorage.setItem("da_reference_id", form.email);
      localStorage.setItem("da_reference_name", "email");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-sky-700 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-sky-100">We are here to help. Reach out anytime.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
            {[
              { icon: MapPin, title: "Address", value: "123 Healthcare Avenue, Bandra West, Mumbai 400050" },
              { icon: Phone, title: "Phone", value: "+91-22-4567-8900 | Emergency: 1800-MED-PLUS" },
              { icon: Mail, title: "Email", value: "support@medicare.example | dpo@medicare.example" },
              { icon: Clock, title: "Hours", value: "OPD: 8am–8pm Mon–Sat | Emergency: 24/7" },
            ].map(({ icon: Icon, title, value }) => (
              <div key={title} className="flex gap-4">
                <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-sky-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{title}</div>
                  <div className="text-gray-500 text-sm">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-8">
            {status === "sent" ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <div className="font-bold text-gray-900 mb-2">Message Sent!</div>
                <p className="text-gray-500 text-sm">We will respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h3 className="font-bold text-gray-900 mb-5">Send us a Message</h3>
                {[
                  { field: "name", label: "Full Name", type: "text", required: true },
                  { field: "email", label: "Email Address", type: "email", required: true },
                  { field: "phone", label: "Phone (optional)", type: "tel", required: false },
                  { field: "subject", label: "Subject", type: "text", required: true },
                ].map(({ field, label, type, required }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type={type}
                      required={required}
                      value={form[field as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 resize-none"
                  />
                </div>
                {status === "error" && (
                  <div className="text-red-600 text-sm">Something went wrong. Please try again.</div>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
                >
                  <Send size={16} /> {status === "sending" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
