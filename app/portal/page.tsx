"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Shield, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Appointment {
  _id: string;
  dateTime: string;
  status: string;
  reason: string;
  doctorId: { name: string; specialization: string };
  departmentId: { name: string };
}

const statusConfig = {
  confirmed: { icon: CheckCircle, color: "text-green-600 bg-green-50", label: "Confirmed" },
  scheduled: { icon: Clock, color: "text-blue-600 bg-blue-50", label: "Scheduled" },
  cancelled: { icon: XCircle, color: "text-red-600 bg-red-50", label: "Cancelled" },
  completed: { icon: CheckCircle, color: "text-gray-600 bg-gray-50", label: "Completed" },
};

export default function PortalPage() {
  const { user, accessToken } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    fetch("/api/appointments/mine", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => r.json())
      .then((d) => setAppointments(d.appointments ?? []))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const cancel = async (id: string) => {
    if (!confirm("Cancel this appointment?")) return;
    await fetch(`/api/appointments/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ reason: "Cancelled by patient" }),
    });
    setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status: "cancelled" } : a));
  };

  if (!user) return <div className="text-center py-20 text-gray-400">Please sign in to access your portal.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Portal header */}
      <div className="bg-sky-700 text-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-1">Patient Portal</h1>
          <p className="text-sky-200">Welcome back, {user.name}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Calendar, label: "Book Appointment", href: "/appointments/book", color: "bg-sky-600" },
            { icon: Shield, label: "Consent Dashboard", href: "/consent/dashboard", color: "bg-teal-600" },
            { icon: FileText, label: "Consent History", href: "/consent/history", color: "bg-indigo-600" },
            { icon: AlertCircle, label: "File Grievance", href: "/grievance", color: "bg-amber-600" },
          ].map(({ icon: Icon, label, href, color }) => (
            <Link key={href} href={href} className={`${color} text-white rounded-xl p-5 flex flex-col gap-3 hover:opacity-90 transition-opacity`}>
              <Icon size={22} />
              <span className="text-sm font-semibold">{label}</span>
            </Link>
          ))}
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">My Appointments</h2>
            <Link href="/appointments/book" className="text-sm text-sky-600 font-medium hover:underline">
              + Book New
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="py-12 text-center text-gray-400">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar size={40} className="text-gray-200 mx-auto mb-3" />
                <div className="text-gray-400">No appointments yet</div>
                <Link href="/appointments/book" className="text-sky-600 text-sm mt-2 inline-block hover:underline">Book your first appointment</Link>
              </div>
            ) : (
              appointments.map((appt) => {
                const s = statusConfig[appt.status as keyof typeof statusConfig] ?? statusConfig.scheduled;
                const StatusIcon = s.icon;
                return (
                  <div key={appt._id} className="px-6 py-5 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                      <StatusIcon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900">{appt.doctorId?.name ?? "Doctor"}</div>
                      <div className="text-sm text-gray-500">{appt.departmentId?.name} · {new Date(appt.dateTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}</div>
                      <div className="text-xs text-gray-400 mt-0.5 truncate">{appt.reason}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>
                      {appt.status === "confirmed" && (
                        <button onClick={() => cancel(appt._id)} className="text-xs text-red-500 hover:text-red-700">Cancel</button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
