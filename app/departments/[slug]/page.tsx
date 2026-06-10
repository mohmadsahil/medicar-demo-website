import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Star } from "lucide-react";

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")} Department` };
}

const DEPT_DATA: Record<string, { name: string; desc: string; services: string[]; doctors: { name: string; qualification: string; specialization: string; experience: number }[] }> = {
  cardiology: {
    name: "Cardiology",
    desc: "Our Cardiology department is equipped with state-of-the-art catheterization labs, advanced cardiac imaging, and a dedicated Cardiac ICU. Our team of cardiologists and cardiac surgeons provide comprehensive care for all heart conditions.",
    services: ["Coronary Angiography & Angioplasty", "Echocardiography", "Cardiac MRI/CT", "Pacemaker Implantation", "Open Heart Surgery", "Heart Failure Management"],
    doctors: [
      { name: "Dr. Rajesh Mehta", qualification: "MD, DM (Cardiology)", specialization: "Interventional Cardiology", experience: 18 },
      { name: "Dr. Priya Sharma", qualification: "MBBS, MD, DM", specialization: "Electrophysiology", experience: 12 },
    ],
  },
  neurology: {
    name: "Neurology & Neurosurgery",
    desc: "Comprehensive neurological care covering stroke, epilepsy, Parkinson's disease, brain tumors, and spinal disorders. Our Neuro ICU operates 24/7 with specialist coverage.",
    services: ["Stroke Management", "Epilepsy Clinic", "Movement Disorders", "Brain Tumor Surgery", "Spine Surgery", "EEG & EMG"],
    doctors: [
      { name: "Dr. Anil Kumar", qualification: "MD, DM (Neurology)", specialization: "Stroke & Vascular Neurology", experience: 20 },
    ],
  },
};

export default async function DepartmentPage({ params }: PageProps) {
  const { slug } = await params;
  const dept = DEPT_DATA[slug] ?? {
    name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
    desc: `Our ${slug} department provides comprehensive, patient-centered care with expert specialists and advanced technology.`,
    services: ["Consultation & Diagnosis", "Advanced Procedures", "Follow-up Care", "Preventive Services"],
    doctors: [
      { name: "Dr. Specialist", qualification: "MD, DM", specialization: "General Specialist", experience: 10 },
    ],
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-sky-700 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-sky-200 text-sm mb-2">
            <Link href="/departments" className="hover:text-white">Departments</Link> / {dept.name}
          </div>
          <h1 className="text-4xl font-bold mb-3">{dept.name}</h1>
          <p className="text-sky-100 max-w-2xl">{dept.desc}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Services Offered</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {dept.services.map((s) => (
                  <div key={s} className="bg-white rounded-lg px-4 py-3 border border-gray-100 text-sm text-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-500" /> {s}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Our Specialists</h2>
              <div className="space-y-4">
                {dept.doctors.map((doc) => (
                  <div key={doc.name} className="bg-white rounded-xl p-5 border border-gray-100 flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xl font-bold">
                      {doc.name.split(" ").map((n) => n[0]).slice(1, 3).join("")}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{doc.name}</div>
                      <div className="text-sm text-gray-500">{doc.qualification}</div>
                      <div className="text-sm text-sky-600">{doc.specialization}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs text-gray-500">{doc.experience} years experience</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-sky-600 text-white rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Book a Consultation</h3>
              <p className="text-sky-100 text-sm mb-4">Get expert care from our {dept.name} specialists.</p>
              <Link
                href="/appointments/book"
                className="flex items-center justify-center gap-2 bg-white text-sky-700 px-5 py-3 rounded-lg font-semibold hover:bg-sky-50 transition-colors w-full text-sm"
              >
                <Calendar size={15} /> Book Appointment
              </Link>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Emergency</h3>
              <p className="text-sm text-gray-500 mb-3">For emergencies, call us immediately.</p>
              <a href="tel:18006837587" className="text-red-600 font-bold text-lg">1800-MED-PLUS</a>
              <div className="text-xs text-gray-400 mt-1">Available 24/7</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
