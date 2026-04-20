"use client";

import { useState } from "react";

type FormState = { name: string; email: string; message: string; consentId: string };
type Errors = Partial<FormState>;

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "", consentId: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Invalid email address.";
    }
    if (!form.message.trim()) {
      e.message = "Message is required.";
    } else if (form.message.trim().length < 10) {
      e.message = "Message must be at least 10 characters.";
    }
    if (!form.consentId.trim()) e.consentId = "Consent ID is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message, consentId: form.consentId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  const contactInfo = [
    {
      label: "Address",
      value: "123 Innovation Drive, Suite 400\nSan Francisco, CA 94107, USA",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
    },
    {
      label: "Phone",
      value: "+1 (415) 555-0100",
      href: "tel:+14155550100",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      ),
    },
    {
      label: "Email",
      value: "hello@demo.com",
      href: "mailto:hello@demo.com",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      label: "Business Hours",
      value: "Monday to Friday: 9am to 6pm PST\nSaturday and Sunday: Closed",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          Have a question or want to work together? Our team is ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          {submitted ? (
            <div className="card border border-green-200 bg-green-50 text-center py-14">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent</h3>
              <p className="text-green-700 text-sm">
                Thank you, <strong>{form.name}</strong>. We will respond to{" "}
                <strong>{form.email}</strong> within 24 hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "", consentId: "" }); }}
                className="mt-6 btn-primary"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-5" noValidate>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Send a Message</h2>
                <p className="text-sm text-gray-500">We typically respond within one business day.</p>
              </div>

              <div>
                <label className="form-label" htmlFor="ct-name">Full Name <span className="text-red-500">*</span></label>
                <input
                  id="ct-name"
                  type="text"
                  className={`form-input ${errors.name ? "border-red-400" : ""}`}
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="ct-email">Email Address <span className="text-red-500">*</span></label>
                <input
                  id="ct-email"
                  type="email"
                  className={`form-input ${errors.email ? "border-red-400" : ""}`}
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="ct-message">Message <span className="text-red-500">*</span></label>
                <textarea
                  id="ct-message"
                  rows={6}
                  className={`form-input resize-none ${errors.message ? "border-red-400" : ""}`}
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="ct-consent">Consent ID <span className="text-red-500">*</span></label>
                <input
                  id="ct-consent"
                  type="text"
                  className={`form-input font-mono text-sm ${errors.consentId ? "border-red-400" : ""}`}
                  placeholder="Enter your Digital Anumati consent ID"
                  value={form.consentId}
                  onChange={(e) => setForm((f) => ({ ...f, consentId: e.target.value }))}
                />
                {errors.consentId && <p className="text-red-500 text-xs mt-1">{errors.consentId}</p>}
              </div>

              {serverError && (
                <div className="text-red-700 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-5">
              {contactInfo.map(({ label, value, href, icon }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm text-blue-600 hover:underline mt-0.5 block">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500 mt-0.5 whitespace-pre-line">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 h-72">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0865654185486!2d-122.41941548468166!3d37.77492977975951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1624000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
