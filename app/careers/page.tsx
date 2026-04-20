"use client";

import { useState } from "react";

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    dept: "Engineering",
    type: "Full-time",
    location: "Remote",
    salary: "$130k – $170k",
    desc: "Lead the development of our core product UI using React and Next.js. You will define frontend architecture, mentor junior engineers, and collaborate closely with design.",
  },
  {
    id: 2,
    title: "Backend Engineer",
    dept: "Engineering",
    type: "Full-time",
    location: "Hybrid",
    salary: "$120k – $160k",
    desc: "Design and maintain high-throughput APIs and microservices. Experience with Node.js or Go required. Familiarity with distributed systems and cloud infrastructure is a strong plus.",
  },
  {
    id: 3,
    title: "Product Designer",
    dept: "Design",
    type: "Full-time",
    location: "On-site",
    salary: "$110k – $145k",
    desc: "Own the end-to-end design process for our platform. Conduct user research, produce wireframes and high-fidelity mockups, and iterate based on qualitative and quantitative feedback.",
  },
  {
    id: 4,
    title: "Growth Marketing Manager",
    dept: "Marketing",
    type: "Full-time",
    location: "Remote",
    salary: "$90k – $120k",
    desc: "Drive pipeline growth through data-driven campaigns, SEO, and content strategy. You will own the full-funnel metrics and work directly with the sales and product teams.",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    dept: "Infrastructure",
    type: "Full-time",
    location: "Remote",
    salary: "$125k – $160k",
    desc: "Manage and improve our Kubernetes-based cloud infrastructure. Implement CI/CD pipelines, observability tooling, and ensure platform reliability meets our 99.99% SLA.",
  },
  {
    id: 6,
    title: "Customer Success Manager",
    dept: "Customer Success",
    type: "Full-time",
    location: "Hybrid",
    salary: "$80k – $110k",
    desc: "Own relationships with enterprise accounts post-sale. Drive adoption, reduce churn, and serve as the voice of the customer internally to influence product direction.",
  },
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  position: string;
  resume: File | null;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function CareersPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", position: "", resume: null, message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [selectedJob, setSelectedJob] = useState<string>("");

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Invalid email address.";
    }
    if (!form.phone.trim()) {
      e.phone = "Phone is required.";
    } else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) {
      e.phone = "Invalid phone number.";
    }
    if (!form.position.trim()) e.position = "Please select a position.";
    if (!form.resume) e.resume = "Please upload your resume.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (!consentChecked) {
      setConsentError("Please confirm your consent before submitting.");
      return;
    }
    setConsentError("");
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          position: form.position,
          resumeName: form.resume!.name,
          message: form.message,
          consentId: localStorage.getItem("da_consent_id") ?? "",
        }),
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

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setForm((f) => ({ ...f, resume: file }));
    if (file) setErrors((err) => ({ ...err, resume: undefined }));
  }

  function applyFor(title: string) {
    setSelectedJob(title);
    setForm((f) => ({ ...f, position: title }));
    document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" });
  }

  const depts = [...new Set(jobs.map((j) => j.dept))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Careers at Demo</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          Join a team of exceptional people building infrastructure that powers businesses worldwide.
          We offer competitive compensation, full benefits, and genuine ownership.
        </p>
      </div>

      {/* Culture cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { title: "Remote-first culture", desc: "Work from anywhere. We have team members in 24 countries and async-first processes that let everyone do their best work." },
          { title: "Competitive total comp", desc: "Top-of-market salaries, equity that vests over 4 years, full health and dental coverage, and a generous equipment budget." },
          { title: "Grow your career", desc: "Dedicated learning budgets, conference allowances, and a clear career ladder reviewed bi-annually with your manager." },
        ].map(({ title, desc }) => (
          <div key={title} className="card border-l-4 border-l-blue-600">
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* Job listings */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Open Positions</h2>
        <p className="text-gray-500 text-sm mb-8">{jobs.length} open roles across {depts.length} departments</p>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`card hover:shadow-md transition-all duration-200 ${
                selectedJob === job.title ? "ring-2 ring-blue-500 ring-offset-1" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-gray-900">{job.title}</h3>
                    <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2.5 py-0.5 rounded-full">{job.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                    <span>{job.dept}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.salary}</span>
                  </div>
                  <p className="text-sm text-gray-600">{job.desc}</p>
                </div>
                <button
                  onClick={() => applyFor(job.title)}
                  className="btn-primary text-sm py-2.5 px-5 flex-shrink-0"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application form */}
      <section id="apply-form">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Submit Your Application</h2>
          <p className="text-gray-500 text-sm mb-8">
            Our talent team reviews every application and responds within 3 business days.
          </p>

          {submitted ? (
            <div className="card border border-green-200 bg-green-50 text-center py-12">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Application Received</h3>
              <p className="text-green-700 text-sm">
                Thank you, <strong>{form.name}</strong>. Your application for{" "}
                <strong>{form.position}</strong> has been submitted. We will be in touch soon.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", phone: "", position: "", resume: null, message: "" });
                  setSelectedJob("");
                  setConsentChecked(false);
                  setConsentError("");
                }}
                className="mt-6 btn-primary"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-5" noValidate>
              <div>
                <label className="form-label" htmlFor="name">Full Name <span className="text-red-500">*</span></label>
                <input
                  id="name"
                  type="text"
                  className={`form-input ${errors.name ? "border-red-400" : ""}`}
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="c-email">Email Address <span className="text-red-500">*</span></label>
                <input
                  id="c-email"
                  type="email"
                  className={`form-input ${errors.email ? "border-red-400" : ""}`}
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="phone">Phone Number <span className="text-red-500">*</span></label>
                <input
                  id="phone"
                  type="tel"
                  className={`form-input ${errors.phone ? "border-red-400" : ""}`}
                  placeholder="+1 (415) 000-0000"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="position">Position Applied For <span className="text-red-500">*</span></label>
                <select
                  id="position"
                  className={`form-input ${errors.position ? "border-red-400" : ""}`}
                  value={form.position}
                  onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                >
                  <option value="">Select a position</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.title}>{j.title}</option>
                  ))}
                  <option value="Other">Other / General Inquiry</option>
                </select>
                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="resume">Resume <span className="text-red-500">*</span></label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    errors.resume
                      ? "border-red-400 bg-red-50"
                      : form.resume
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-blue-400 bg-gray-50"
                  }`}
                >
                  <input id="resume" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} />
                  <label htmlFor="resume" className="cursor-pointer">
                    {form.resume ? (
                      <span className="text-green-700 font-medium text-sm flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {form.resume.name}
                      </span>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                        </svg>
                        <span className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</span>
                        <span className="text-xs text-gray-400 block mt-1">PDF, DOC, DOCX — max 5MB</span>
                      </>
                    )}
                  </label>
                </div>
                {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="message">Cover Note <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  id="message"
                  rows={4}
                  className="form-input resize-none"
                  placeholder="Tell us why you are a great fit for this role..."
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600"
                  checked={consentChecked}
                  onChange={(e) => { setConsentChecked(e.target.checked); setConsentError(""); }}
                />
                <span className="text-sm text-gray-600">
                  I confirm that I have reviewed and agree to the data consent associated with this application.
                </span>
              </label>
              {consentError && <p className="text-red-500 text-xs -mt-2">{consentError}</p>}

              {serverError && (
                <div className="text-red-700 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-lg">{serverError}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Submit Application
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
