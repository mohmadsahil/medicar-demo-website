import { Metadata } from "next";
import Link from "next/link";
import { Heart, Brain, Bone, Baby, FlaskConical, Microscope, Eye, Wind, Pill, Activity } from "lucide-react";

export const metadata: Metadata = { title: "Departments" };

const DEPARTMENTS = [
  { name: "Cardiology", slug: "cardiology", icon: Heart, desc: "Heart disease, interventional cardiology, cardiac surgery" },
  { name: "Neurology & Neurosurgery", slug: "neurology", icon: Brain, desc: "Brain, spine, stroke, epilepsy, Parkinson's" },
  { name: "Orthopedics & Sports Medicine", slug: "orthopedics", icon: Bone, desc: "Joint replacement, arthroscopy, sports injury" },
  { name: "Pediatrics & Neonatology", slug: "pediatrics", icon: Baby, desc: "Child health, NICU, developmental pediatrics" },
  { name: "Medical Oncology", slug: "oncology", icon: FlaskConical, desc: "Cancer chemotherapy, immunotherapy, BMT" },
  { name: "Pathology & Diagnostics", slug: "pathology", icon: Microscope, desc: "Lab diagnostics, histopathology, molecular testing" },
  { name: "Ophthalmology", slug: "ophthalmology", icon: Eye, desc: "Cataract, LASIK, retinal diseases" },
  { name: "Pulmonology", slug: "pulmonology", icon: Wind, desc: "Respiratory, sleep medicine, critical care" },
  { name: "Endocrinology", slug: "endocrinology", icon: Pill, desc: "Diabetes, thyroid, hormonal disorders" },
  { name: "Gastroenterology", slug: "gastroenterology", icon: Activity, desc: "Liver, GI, endoscopy, hepatology" },
];

export default function DepartmentsPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-sky-700 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Our Departments</h1>
          <p className="text-sky-100">15 specialties. 150+ doctors. One destination for all your healthcare needs.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEPARTMENTS.map(({ name, slug, icon: Icon, desc }) => (
            <Link
              key={slug}
              href={`/departments/${slug}`}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-100 transition-colors">
                <Icon size={22} className="text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
              <p className="text-sm text-gray-500 mb-4">{desc}</p>
              <span className="text-sky-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                View department →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
