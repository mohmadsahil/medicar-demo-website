import Link from "next/link";
import { Heart, Brain, Bone, Baby, FlaskConical, Microscope, Calendar, Phone, Star, Shield, Award, Users } from "lucide-react";

const DEPARTMENTS = [
  { name: "Cardiology", icon: Heart, slug: "cardiology", desc: "Advanced cardiac care & interventions" },
  { name: "Neurology", icon: Brain, slug: "neurology", desc: "Comprehensive brain & spine care" },
  { name: "Orthopedics", icon: Bone, slug: "orthopedics", desc: "Joint replacement & sports medicine" },
  { name: "Pediatrics", icon: Baby, slug: "pediatrics", desc: "Expert care for children 0–18 years" },
  { name: "Oncology", icon: FlaskConical, slug: "oncology", desc: "Cancer diagnosis & treatment center" },
  { name: "Pathology", icon: Microscope, slug: "pathology", desc: "Advanced diagnostics & lab services" },
];

const STATS = [
  { value: "25,000+", label: "Patients Annually", icon: Users },
  { value: "150+", label: "Expert Doctors", icon: Award },
  { value: "98%", label: "Patient Satisfaction", icon: Star },
  { value: "24/7", label: "Emergency Care", icon: Phone },
];

const SERVICES = [
  "Advanced Cardiac Surgery", "Robotic Joint Replacement", "Cancer Care Center",
  "Neonatal ICU", "Neuro ICU", "Digital Radiology & MRI",
  "Bone Marrow Transplant", "Organ Transplant Program",
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-sky-700 via-sky-600 to-teal-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-24 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Shield size={14} /> NABH Accredited · JCI Certified · DPDP Act 2023 Compliant
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Compassionate Care.<br />
              <span className="text-teal-200">Advanced Medicine.</span>
            </h1>
            <p className="text-lg text-sky-100 mb-8 leading-relaxed">
              MediCare Plus Hospital — Mumbai&apos;s premier multi-specialty healthcare destination.
              Expert doctors, cutting-edge technology, and a commitment to your complete well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/appointments/book"
                className="inline-flex items-center justify-center gap-2 bg-white text-sky-700 px-8 py-3.5 rounded-xl font-bold text-base shadow-lg hover:bg-sky-50 transition-colors"
              >
                <Calendar size={18} /> Book Appointment Here
              </Link>
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-white/10 transition-colors"
              >
                Find a Doctor
              </Link>
              <a
                href="tel:18006837587"
                className="inline-flex items-center justify-center gap-2 bg-red-500 text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-red-600 transition-colors"
              >
                <Phone size={18} /> Emergency
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-50 rounded-xl mb-3">
                <Icon size={22} className="text-sky-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Specialties</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              15 specialty departments staffed by over 150 experienced doctors delivering care across every stage of life.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEPARTMENTS.map(({ name, icon: Icon, slug, desc }) => (
              <Link
                key={slug}
                href={`/departments/${slug}`}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-100 transition-colors">
                  <Icon size={22} className="text-sky-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
                <div className="mt-4 text-sky-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                  Learn more →
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/departments" className="text-sky-600 font-semibold hover:underline">
              View all 15 departments →
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-sky-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Advanced Services</h2>
            <p className="text-sky-200 max-w-xl mx-auto">State-of-the-art medical technologies and procedures.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SERVICES.map((s) => (
              <div key={s} className="bg-white/10 backdrop-blur rounded-xl px-5 py-4 text-sm font-medium text-center border border-white/20 hover:bg-white/20 transition-colors">
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DPDP Consent Banner */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            <Shield size={14} /> DPDP Act 2023 Compliant
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Data, Your Control</h2>
          <p className="text-gray-500 mb-8 leading-relaxed max-w-2xl mx-auto">
            MediCare Plus is committed to protecting your personal health data under the Digital Personal Data
            Protection Act 2023. You have the right to access, correct, delete, and withdraw consent for
            every piece of data we collect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consent/dashboard"
              className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors"
            >
              <Shield size={16} /> Manage My Consents
            </Link>
            <Link
              href="/privacy-policy"
              className="inline-flex items-center gap-2 border border-sky-200 text-sky-700 px-6 py-3 rounded-xl font-semibold hover:bg-sky-50 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-sky-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Charge of Your Health?</h2>
          <p className="text-sky-100 mb-8">Book a consultation with our specialists today.</p>
          <Link
            href="/appointments/book"
            className="inline-flex items-center gap-2 bg-white text-sky-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-sky-50 transition-colors"
          >
            <Calendar size={20} /> Book an Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
