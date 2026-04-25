import Link from "next/link";

const departments = [
  {
    title: "Cardiology",
    desc: "Advanced heart diagnostics, non-invasive imaging, and post-procedure monitoring.",
  },
  {
    title: "Neurology",
    desc: "Comprehensive stroke care, neuro consults, and long-term recovery management.",
  },
  {
    title: "Orthopedics",
    desc: "Joint care, trauma response, and rehabilitation pathways for all age groups.",
  },
  {
    title: "General Medicine",
    desc: "Primary consultations, preventive health packages, and chronic condition support.",
  },
];

const consentHighlights = [
  "Anonymous consent scenario with multilingual support (English and Hindi).",
  "Required categories for Core Healthcare and Billing & Insurance.",
  "Optional Communication & Engagement consent for follow-ups and reminders.",
  "Processing, storage, analysis, and third-party sharing transparency.",
  "7-year retention disclosure and DPO grievance contact visibility.",
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-900 via-teal-800 to-emerald-800 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-50 mb-5">
              Hospital Website Demo
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Patient-first hospital portal with
              <span className="text-emerald-200">
                {" "}
                consent-first data handling
              </span>
            </h1>
            <p className="mt-5 text-lg text-cyan-50 max-w-2xl">
              Explore a full consent management journey for patient appointment
              booking, healthcare delivery, billing, and optional engagement
              communication.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/book-demo-appointment"
                className="bg-white text-teal-800 hover:bg-cyan-50 font-semibold px-6 py-3 rounded-lg text-center"
              >
                Book Demo Appointment
              </Link>
              <Link
                href="/contact"
                className="border border-white/50 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-lg text-center"
              >
                Contact Care Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { value: "24x7", label: "Emergency Triage" },
            { value: "7y", label: "Retention Disclosure" },
            { value: "3", label: "Consent Categories" },
            { value: "2", label: "Languages Enabled" },
          ].map((stat) => (
            <div key={stat.label} className="card border-l-4 border-l-teal-600">
              <p className="text-3xl font-bold text-teal-700">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900">
              Hospital Services
            </h2>
            <p className="text-slate-500 mt-2 text-lg max-w-2xl">
              Structured like a modern hospital website with specialty
              departments and digital appointment workflows.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.title}
                className="card hover:shadow-md transition-shadow border border-slate-200"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {dept.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {dept.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-slate-50 to-cyan-50 border-y border-cyan-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Consent Data Coverage
              </h2>
              <p className="text-slate-600 mt-3">
                The demo includes data categories for identification, contact
                info, health details, appointment scheduling, billing,
                insurance, and optional communication preferences.
              </p>
              <ul className="mt-6 space-y-3">
                {consentHighlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-700"
                  >
                    <span className="mt-1 w-2.5 h-2.5 rounded-full bg-teal-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card bg-slate-900 text-slate-100 border-slate-800">
              <h3 className="text-xl font-semibold">What You Can Test</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>
                  1. Capture multilingual appointment consent on a real form.
                </p>
                <p>
                  2. Enforce required categories while keeping engagement
                  optional.
                </p>
                <p>
                  3. Store usage records through new dedicated consent demo
                  APIs.
                </p>
                <p>4. Review submission traces from the live usage panel.</p>
              </div>
              <Link
                href="/book-demo-appointment"
                className="inline-block mt-6 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold px-5 py-2.5 rounded-lg"
              >
                Open Booking Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
