"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Calendar, Search } from "lucide-react";

interface Doctor {
  _id: string;
  name: string;
  slug: string;
  qualification: string;
  specialization: string;
  experience: number;
  department: { name: string; slug: string };
  consultationFee: number;
  rating: number;
  availableDays: string[];
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filtered, setFiltered] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((d) => {
        setDoctors(d.doctors ?? []);
        setFiltered(d.doctors ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          d.department?.name?.toLowerCase().includes(q)
      )
    );
  }, [search, doctors]);

  return (
    <div>
      <section className="bg-gradient-to-br from-sky-700 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Our Doctors</h1>
          <p className="text-sky-100 mb-8">150+ specialists across 15 departments.</p>
          <div className="relative max-w-lg mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, specialty, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-gray-900 bg-white shadow-lg outline-none text-sm"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading doctors...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-2">No doctors found</div>
              {doctors.length === 0 && (
                <p className="text-sm text-gray-400">Run the seed script to populate doctor data.</p>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((doc) => (
                <div key={doc._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-br from-sky-50 to-teal-50 p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-2xl font-bold mx-auto mb-3">
                      {doc.name.split(" ").map((n) => n[0]).slice(1, 3).join("")}
                    </div>
                    <h3 className="font-bold text-gray-900">{doc.name}</h3>
                    <div className="text-sm text-gray-500">{doc.qualification}</div>
                    <div className="text-sm text-sky-600 font-medium mt-1">{doc.specialization}</div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3 text-sm">
                      <span className="text-gray-500">{doc.department?.name}</span>
                      <div className="flex items-center gap-1">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        <span className="text-gray-700 font-medium">{doc.rating}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      <span className="font-medium">{doc.experience} yrs</span> experience ·{" "}
                      <span className="text-sky-700 font-medium">₹{doc.consultationFee}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/doctors/${doc.slug}`}
                        className="flex-1 text-center border border-sky-200 text-sky-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-sky-50"
                      >
                        View Profile
                      </Link>
                      <Link
                        href={`/appointments/book?doctor=${doc.slug}`}
                        className="flex-1 text-center bg-sky-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-sky-700 flex items-center justify-center gap-1"
                      >
                        <Calendar size={13} /> Book
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
