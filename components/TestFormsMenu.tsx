"use client";
import { useState } from "react";
import {
  ChevronDown,
  X,
  FileText,
  Mail,
  MessageSquare,
  Pill,
  FlaskConical,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Ambulance,
  Gift,
  Briefcase,
} from "lucide-react";

const DA_TRIGGER = "456534a9-6ad2-4243-ab8c-18d12435bad5";

type FieldType = "text" | "email" | "tel" | "date" | "number" | "textarea" | "select";

interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
}

interface FormDef {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  description: string;
  submitLabel: string;
  fields: Field[];
}

const FORMS: FormDef[] = [
  {
    id: "newsletter",
    label: "Newsletter Subscribe",
    icon: Mail,
    title: "Subscribe to Newsletter",
    description: "Health tips and hospital updates delivered monthly.",
    submitLabel: "Subscribe",
    fields: [
      { name: "email", label: "Email", type: "email", required: true },
      {
        name: "frequency",
        label: "Frequency",
        type: "select",
        options: ["Weekly", "Monthly", "Quarterly"],
      },
    ],
  },
  {
    id: "feedback",
    label: "Patient Feedback",
    icon: MessageSquare,
    title: "Share Your Feedback",
    description: "Tell us about your recent visit.",
    submitLabel: "Send Feedback",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      {
        name: "rating",
        label: "Rating",
        type: "select",
        options: ["5 - Excellent", "4 - Good", "3 - Average", "2 - Poor", "1 - Very Poor"],
      },
      { name: "comments", label: "Comments", type: "textarea", required: true },
    ],
  },
  {
    id: "callback",
    label: "Request Callback",
    icon: FileText,
    title: "Request a Callback",
    description: "We will call you at your preferred time.",
    submitLabel: "Request Call",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "preferredTime", label: "Preferred Time", type: "select", options: ["Morning", "Afternoon", "Evening"] },
    ],
  },
  {
    id: "refill",
    label: "Prescription Refill",
    icon: Pill,
    title: "Prescription Refill Request",
    description: "Request a refill of an existing prescription.",
    submitLabel: "Request Refill",
    fields: [
      { name: "patientId", label: "Patient ID", type: "text", required: true },
      { name: "medication", label: "Medication Name", type: "text", required: true },
      { name: "dosage", label: "Dosage", type: "text" },
      { name: "pharmacy", label: "Preferred Pharmacy", type: "text" },
    ],
  },
  {
    id: "lab",
    label: "Lab Test Booking",
    icon: FlaskConical,
    title: "Book a Lab Test",
    description: "Schedule diagnostic tests at our lab or home.",
    submitLabel: "Book Test",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "phone", label: "Phone", type: "tel", required: true },
      {
        name: "test",
        label: "Test",
        type: "select",
        options: ["CBC", "Lipid Profile", "Thyroid Panel", "HbA1c", "Vitamin D"],
      },
      { name: "date", label: "Preferred Date", type: "date", required: true },
      { name: "collection", label: "Collection", type: "select", options: ["At Lab", "Home Collection"] },
    ],
  },
  {
    id: "assessment",
    label: "Health Assessment",
    icon: HeartPulse,
    title: "Free Health Assessment",
    description: "Quick self-assessment to get personalised advice.",
    submitLabel: "Submit Assessment",
    fields: [
      { name: "age", label: "Age", type: "number", required: true },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
      { name: "conditions", label: "Existing Conditions", type: "textarea" },
      { name: "smoker", label: "Smoker?", type: "select", options: ["No", "Occasional", "Regular"] },
    ],
  },
  {
    id: "insurance",
    label: "Insurance Query",
    icon: ShieldCheck,
    title: "Insurance / Cashless Query",
    description: "Check network eligibility for your insurer.",
    submitLabel: "Check Coverage",
    fields: [
      { name: "name", label: "Policy Holder", type: "text", required: true },
      { name: "insurer", label: "Insurance Provider", type: "text", required: true },
      { name: "policyNumber", label: "Policy Number", type: "text", required: true },
      { name: "treatment", label: "Planned Treatment", type: "textarea" },
    ],
  },
  {
    id: "opinion",
    label: "Second Opinion",
    icon: Stethoscope,
    title: "Get a Second Opinion",
    description: "Consult a senior specialist about your diagnosis.",
    submitLabel: "Request Opinion",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      {
        name: "specialty",
        label: "Specialty",
        type: "select",
        options: ["Oncology", "Cardiology", "Neurology", "Orthopedics", "Other"],
      },
      { name: "summary", label: "Case Summary", type: "textarea", required: true },
    ],
  },
  {
    id: "vaccine",
    label: "Vaccination Booking",
    icon: Syringe,
    title: "Book Vaccination Slot",
    description: "Reserve a slot for you or your family.",
    submitLabel: "Book Slot",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "dob", label: "Date of Birth", type: "date", required: true },
      {
        name: "vaccine",
        label: "Vaccine",
        type: "select",
        options: ["Influenza", "HPV", "Hepatitis B", "Tdap", "COVID-19 Booster"],
      },
      { name: "date", label: "Preferred Date", type: "date", required: true },
    ],
  },
  {
    id: "ambulance",
    label: "Ambulance Booking",
    icon: Ambulance,
    title: "Book an Ambulance",
    description: "Non-emergency transport. For emergencies dial 108.",
    submitLabel: "Request Ambulance",
    fields: [
      { name: "name", label: "Patient Name", type: "text", required: true },
      { name: "phone", label: "Contact Phone", type: "tel", required: true },
      { name: "pickup", label: "Pickup Address", type: "textarea", required: true },
      {
        name: "type",
        label: "Ambulance Type",
        type: "select",
        options: ["Basic", "Advanced Life Support", "Cardiac"],
      },
    ],
  },
  {
    id: "donation",
    label: "Donate / Donor Sign-up",
    icon: Gift,
    title: "Donate or Register as Donor",
    description: "Support the hospital foundation or blood bank.",
    submitLabel: "Submit",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "type", label: "Type", type: "select", options: ["Monetary Donation", "Blood Donor", "Organ Donor"] },
      { name: "bloodGroup", label: "Blood Group (if donor)", type: "text" },
    ],
  },
  {
    id: "careers",
    label: "Careers Application",
    icon: Briefcase,
    title: "Apply for a Role",
    description: "Join our clinical or non-clinical team.",
    submitLabel: "Submit Application",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "role", label: "Role Applying For", type: "text", required: true },
      { name: "experience", label: "Years of Experience", type: "number" },
      { name: "notes", label: "Cover Note", type: "textarea" },
    ],
  },
];

export default function TestFormsMenu() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<FormDef | null>(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 rounded-md hover:bg-sky-50 transition-colors">
        Forms <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 max-h-[70vh] overflow-y-auto">
          {FORMS.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setActive(f);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 text-left"
              >
                <Icon size={14} /> {f.label}
              </button>
            );
          })}
        </div>
      )}

      {active && <FormDialog form={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function FormDialog({ form, onClose }: { form: FormDef; onClose: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const setVal = (k: string, v: string) => setValues((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    console.log(`[TestForm:${form.id}] submit`, values);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{form.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{form.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 -mt-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Submitted</h4>
            <p className="text-sm text-gray-500 mb-5">
              Trigger fired for form <code>{form.id}</code>.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-3 overflow-y-auto">
            {form.fields.map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {f.label}
                  {f.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    required={f.required}
                    value={values[f.name] ?? ""}
                    onChange={(e) => setVal(f.name, e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                ) : f.type === "select" ? (
                  <select
                    required={f.required}
                    value={values[f.name] ?? ""}
                    onChange={(e) => setVal(f.name, e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="">Choose...</option>
                    {f.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    required={f.required}
                    value={values[f.name] ?? ""}
                    onChange={(e) => setVal(f.name, e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                )}
              </div>
            ))}

            <label className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-xs text-gray-600 leading-relaxed">
                I consent under the DPDP Act, 2023 to Anumati Health processing
                the data submitted in this form for the stated purpose. I may
                withdraw anytime via the Consent Dashboard.
              </span>
            </label>

            <button
              type="submit"
              da-trigger={DA_TRIGGER}
              data-form-id={form.id}
              disabled={submitting || !agreed}
              className="w-full bg-sky-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors mt-2"
            >
              {submitting ? "Submitting..." : form.submitLabel}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
