"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Mail,
  MessageSquare,
  FileText,
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

const FORMS = [
  { slug: "newsletter", label: "Newsletter Subscribe", icon: Mail },
  { slug: "feedback", label: "Patient Feedback", icon: MessageSquare },
  { slug: "callback", label: "Request Callback", icon: FileText },
  { slug: "refill", label: "Prescription Refill", icon: Pill },
  { slug: "lab-test", label: "Lab Test Booking", icon: FlaskConical },
  { slug: "assessment", label: "Health Assessment", icon: HeartPulse },
  { slug: "insurance", label: "Insurance Query", icon: ShieldCheck },
  { slug: "second-opinion", label: "Second Opinion", icon: Stethoscope },
  { slug: "vaccination", label: "Vaccination Booking", icon: Syringe },
  { slug: "ambulance", label: "Ambulance Booking", icon: Ambulance },
  { slug: "donation", label: "Donate / Donor Sign-up", icon: Gift },
  { slug: "careers", label: "Careers Application", icon: Briefcase },
];

export default function TestFormsMenu() {
  const [open, setOpen] = useState(false);

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
              <Link
                key={f.slug}
                href={`/test-forms/${f.slug}`}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600"
              >
                <Icon size={14} /> {f.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
