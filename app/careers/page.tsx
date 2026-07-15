"use client";
import { useState } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  X,
  Upload,
  Building2,
} from "lucide-react";

const DA_TRIGGER = "456534a9-6ad2-4243-ab8c-18d12435bad5";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  posted: string;
  description: string;
  skills: string[];
}

const JOBS: Job[] = [
  {
    id: "cardiologist-sr",
    title: "Senior Cardiologist",
    department: "Cardiology",
    location: "Mumbai",
    type: "Full-time",
    experience: "8+ years",
    salary: "₹40–60 LPA",
    posted: "2 days ago",
    description: "Lead interventional cardiology programs and mentor junior consultants.",
    skills: ["Angioplasty", "TAVR", "Echocardiography"],
  },
  {
    id: "nurse-icu",
    title: "ICU Staff Nurse",
    department: "Critical Care",
    location: "Pune",
    type: "Full-time",
    experience: "2+ years",
    salary: "₹4.5–6 LPA",
    posted: "5 days ago",
    description: "Provide critical care in a 24-bed multi-disciplinary ICU.",
    skills: ["BLS", "ACLS", "Ventilator care"],
  },
  {
    id: "radiologist",
    title: "Consultant Radiologist",
    department: "Radiology",
    location: "Bengaluru",
    type: "Full-time",
    experience: "5+ years",
    salary: "₹25–35 LPA",
    posted: "1 week ago",
    description: "Report CT, MRI, and interventional radiology studies.",
    skills: ["MRI", "CT", "PACS"],
  },
  {
    id: "pediatrician",
    title: "Pediatrician",
    department: "Pediatrics",
    location: "Delhi",
    type: "Full-time",
    experience: "4+ years",
    salary: "₹18–24 LPA",
    posted: "3 days ago",
    description: "OPD and inpatient pediatric care, including NICU coverage.",
    skills: ["Neonatology", "PALS", "Vaccination"],
  },
  {
    id: "pharmacist",
    title: "Clinical Pharmacist",
    department: "Pharmacy",
    location: "Mumbai",
    type: "Full-time",
    experience: "1+ years",
    salary: "₹3.5–5 LPA",
    posted: "1 day ago",
    description: "Medication review, IV admixture, and drug information services.",
    skills: ["Pharm.D preferred", "Hospital pharmacy"],
  },
  {
    id: "lab-tech",
    title: "Lab Technician",
    department: "Diagnostics",
    location: "Hyderabad",
    type: "Full-time",
    experience: "1–3 years",
    salary: "₹2.8–4 LPA",
    posted: "6 days ago",
    description: "Sample collection, processing, and reporting in NABL lab.",
    skills: ["Phlebotomy", "Hematology", "Biochemistry"],
  },
  {
    id: "physio",
    title: "Senior Physiotherapist",
    department: "Rehab",
    location: "Chennai",
    type: "Full-time",
    experience: "3+ years",
    salary: "₹5–7 LPA",
    posted: "4 days ago",
    description: "Neuro and ortho rehab. Inpatient and outpatient case load.",
    skills: ["Neuro rehab", "Sports injury"],
  },
  {
    id: "hr-manager",
    title: "HR Manager",
    department: "Human Resources",
    location: "Mumbai",
    type: "Full-time",
    experience: "6+ years",
    salary: "₹12–16 LPA",
    posted: "1 week ago",
    description: "Own end-to-end HR for a 400-bed unit including talent acquisition.",
    skills: ["Talent acquisition", "ER", "Payroll"],
  },
  {
    id: "billing-exec",
    title: "Billing Executive",
    department: "Finance",
    location: "Pune",
    type: "Full-time",
    experience: "0–2 years",
    salary: "₹2.4–3.2 LPA",
    posted: "Just now",
    description: "Insurance claims, TPA coordination, and patient billing.",
    skills: ["TPA", "GST basics", "Advanced Excel"],
  },
  {
    id: "frontend-dev",
    title: "Frontend Engineer",
    department: "Digital Health",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
    salary: "₹18–28 LPA",
    posted: "2 days ago",
    description: "Build patient-facing apps in Next.js and React for our hospital network.",
    skills: ["Next.js", "TypeScript", "Tailwind"],
  },
];

export default function CareersPage() {
  const [active, setActive] = useState<Job | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-sky-600 text-xs font-semibold bg-sky-50 px-3 py-1 rounded-full mb-3">
            <Briefcase size={12} /> We are hiring
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Join Anumati Health</h1>
          <p className="text-gray-500 text-sm">
            {JOBS.length} open roles across our hospital network.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {JOBS.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col hover:shadow-md hover:border-sky-300 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Building2 size={18} className="text-sky-600" />
                </div>
                <span className="text-[10px] text-gray-400">{job.posted}</span>
              </div>
              <h3 className="font-semibold text-gray-900">{job.title}</h3>
              <div className="text-xs text-sky-600 font-medium mb-2">{job.department}</div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                {job.description}
              </p>
              <div className="space-y-1.5 text-xs text-gray-600 mb-3">
                <div className="flex items-center gap-1.5"><MapPin size={12} /> {job.location}</div>
                <div className="flex items-center gap-1.5"><Clock size={12} /> {job.type} · {job.experience}</div>
                <div className="flex items-center gap-1.5"><IndianRupee size={12} /> {job.salary}</div>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {job.skills.map((s) => (
                  <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {s}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setActive(job)}
                className="mt-auto w-full bg-sky-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-sky-700"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

      </div>

      {active && <ApplyDialog job={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function ApplyDialog({ job, onClose }: { job: Job; onClose: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    console.log(`[Careers:${job.id}] apply`, values);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col shadow-xl">
        <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <div>
            <div className="text-xs text-sky-600 font-semibold">{job.department} · {job.location}</div>
            <h3 className="text-lg font-bold text-gray-900">Apply — {job.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{job.experience} · {job.salary}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Application Submitted</h4>
            <p className="text-sm text-gray-500 mb-5">
              Trigger fired for <code>{job.id}</code>. Our HR team will reach out shortly.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-3 overflow-y-auto">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Full Name" name="name" values={values} set={set} required />
              <Field label="Email" name="email" type="email" values={values} set={set} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Phone" name="phone" type="tel" values={values} set={set} required />
              <Field label="Years of Experience" name="experience" type="number" values={values} set={set} />
            </div>
            <Field label="Current Employer" name="employer" values={values} set={set} />
            <Field label="Notice Period" name="notice" values={values} set={set} />
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Cover Note</label>
              <textarea
                rows={3}
                value={values.notes ?? ""}
                onChange={(e) => set("notes", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center text-xs text-gray-500">
              <Upload size={18} className="mx-auto mb-1 text-gray-400" />
              Attach CV (PDF, mock)
            </div>

            <label className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-xs text-gray-600 leading-relaxed">
                I consent under the DPDP Act, 2023 to Anumati Health processing
                my application data for recruitment. I may withdraw anytime via
                the Consent Dashboard.
              </span>
            </label>

            <button
              type="submit"
              da-trigger={DA_TRIGGER}
              data-form-id={`careers-${job.id}`}
              disabled={submitting || !agreed}
              className="w-full bg-sky-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 mt-2"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  values,
  set,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  values: Record<string, string>;
  set: (k: string, v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={values[name] ?? ""}
        onChange={(e) => set(name, e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      />
    </div>
  );
}
