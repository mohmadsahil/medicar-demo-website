import { Metadata } from "next";
import Link from "next/link";
import { Star, Calendar, Clock, Award } from "lucide-react";

interface PageProps { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Dr. ${id.replace(/-/g, " ")}` };
}

export default async function DoctorDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <section className="bg-gradient-to-br from-sky-700 to-teal-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-sky-200 text-sm mb-4">
            <Link href="/doctors" className="hover:text-white">Doctors</Link> / Profile
          </div>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold shrink-0">
              DR
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Dr. {id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</h1>
              <div className="text-sky-200 mb-2">MD, DM · Specialist</div>
              <div className="flex items-center gap-4 text-sm text-sky-100">
                <span className="flex items-center gap-1"><Star size={14} className="fill-amber-300 text-amber-300" /> 4.8 (124 reviews)</span>
                <span className="flex items-center gap-1"><Award size={14} /> 15+ years experience</span>
                <span className="flex items-center gap-1"><Clock size={14} /> Mon–Sat, 9am–5pm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600 leading-relaxed">
                This doctor specializes in providing comprehensive, evidence-based care with a patient-first approach.
                View the full profile after connecting to the database and running the seed script.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Qualifications</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-sky-500 rounded-full" /> MBBS — AIIMS Delhi</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-sky-500 rounded-full" /> MD — PGI Chandigarh</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-sky-500 rounded-full" /> DM — KEM Hospital Mumbai</li>
              </ul>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-sky-600 text-white rounded-xl p-6">
              <h3 className="font-bold mb-4">Book Appointment</h3>
              <Link
                href={`/appointments/book?doctor=${id}`}
                className="flex items-center justify-center gap-2 bg-white text-sky-700 px-5 py-3 rounded-lg font-semibold hover:bg-sky-50 text-sm w-full"
              >
                <Calendar size={15} /> Book Now — ₹800
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
