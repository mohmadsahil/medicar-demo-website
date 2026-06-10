import { Metadata } from "next";
import { Shield, Award, Users, Heart } from "lucide-react";

export const metadata: Metadata = { title: "About Us" };

const MILESTONES = [
  { year: "2008", event: "Founded as a 100-bed hospital in Bandra West, Mumbai" },
  { year: "2012", event: "NABH Accreditation — National Accreditation Board for Hospitals" },
  { year: "2015", event: "Expanded to 500 beds; launched Cancer Care Center" },
  { year: "2018", event: "JCI International Accreditation" },
  { year: "2021", event: "Opened Robotic Surgery Center and Bone Marrow Transplant Unit" },
  { year: "2024", event: "DPDP Act 2023 compliance — India's first fully compliant hospital portal" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-700 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About MediCare Plus</h1>
          <p className="text-sky-100 text-lg">16 years of compassionate, evidence-based healthcare in Mumbai.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              MediCare Plus Hospital exists to make world-class, compassionate healthcare accessible to every patient.
              We combine cutting-edge medical technology with a deeply human approach — treating every patient as
              a whole person, not just a diagnosis.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We are guided by the values of transparency, integrity, and respect for patient autonomy —
              including their right to control their own health data under the DPDP Act 2023.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Heart, title: "Patient First", desc: "Every decision centers on patient wellbeing" },
              { icon: Shield, title: "Data Privacy", desc: "DPDP Act 2023 compliant data practices" },
              { icon: Award, title: "Excellence", desc: "NABH & JCI accredited standards of care" },
              { icon: Users, title: "Community", desc: "150+ doctors, 1,200+ staff, one family" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-sky-50 rounded-xl p-5">
                <Icon size={22} className="text-sky-600 mb-2" />
                <div className="font-semibold text-gray-900 mb-1">{title}</div>
                <div className="text-sm text-gray-500">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Journey</h2>
          <div className="space-y-6">
            {MILESTONES.map(({ year, event }) => (
              <div key={year} className="flex gap-6 items-start">
                <div className="w-16 shrink-0 text-sky-600 font-bold text-lg text-right">{year}</div>
                <div className="w-3 h-3 rounded-full bg-sky-600 mt-2 shrink-0" />
                <div className="text-gray-700 leading-relaxed">{event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
