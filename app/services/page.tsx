import { Metadata } from "next";
import { Activity, Zap, FlaskConical, Heart, Brain, Stethoscope } from "lucide-react";

export const metadata: Metadata = { title: "Services" };

const SERVICES = [
  { icon: Heart, title: "Cardiac Care", items: ["24/7 Cath Lab", "ECMO", "LVAD", "Heart Transplant Evaluation"] },
  { icon: Brain, title: "Neuro Sciences", items: ["Stroke Thrombolysis", "Deep Brain Stimulation", "Craniotomy", "Spine Stabilization"] },
  { icon: FlaskConical, title: "Oncology", items: ["Medical Oncology", "Radiation Therapy", "Bone Marrow Transplant", "Immunotherapy"] },
  { icon: Activity, title: "Critical Care", items: ["Medical ICU", "Surgical ICU", "Neuro ICU", "Cardiac ICU"] },
  { icon: Zap, title: "Robotic Surgery", items: ["Da Vinci System", "Robotic Knee Replacement", "Robotic Prostatectomy", "Laparoscopy"] },
  { icon: Stethoscope, title: "Preventive Health", items: ["Executive Health Checks", "Vaccination", "Cancer Screening", "Cardiac Screening"] },
];

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-sky-700 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Our Services</h1>
          <p className="text-sky-100">Comprehensive medical services under one roof.</p>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(({ icon: Icon, title, items }) => (
            <div key={title} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-4">
                <Icon size={22} className="text-sky-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-3">{title}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
