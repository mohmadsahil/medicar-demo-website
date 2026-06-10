"use client";
import { useEffect, useState } from "react";
import { Shield, Users, Check, X, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function ConsentAnalyticsPage() {
  const { user, accessToken } = useAuth();
  const [stats, setStats] = useState({
    totalConsents: 0, granted: 0, withdrawn: 0, expired: 0,
    totalWebhookEvents: 0, emailsSent: 0,
  });

  useEffect(() => {
    if (!accessToken) return;
    fetch("/api/admin/consent-stats", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => r.json())
      .then((d) => d.stats && setStats(d.stats))
      .catch(() => {});
  }, [accessToken]);

  if (!user || user.role !== "admin") return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Admin access required. <Link href="/" className="text-sky-600 ml-1 hover:underline">Go home</Link>
    </div>
  );

  const cards = [
    { label: "Total Consent Records", value: stats.totalConsents, icon: Shield, color: "bg-sky-100 text-sky-700" },
    { label: "Active Consents", value: stats.granted, icon: Check, color: "bg-green-100 text-green-700" },
    { label: "Withdrawn Consents", value: stats.withdrawn, icon: X, color: "bg-red-100 text-red-700" },
    { label: "Webhook Events", value: stats.totalWebhookEvents, icon: TrendingUp, color: "bg-purple-100 text-purple-700" },
    { label: "Emails Dispatched", value: stats.emailsSent, icon: Users, color: "bg-indigo-100 text-indigo-700" },
    { label: "Expired Consents", value: stats.expired, icon: Shield, color: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-sky-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1"><Shield size={24} /><h1 className="text-2xl font-bold">Consent Analytics</h1></div>
            <p className="text-sky-200 text-sm">DPDP Act 2023 compliance overview</p>
          </div>
          <Link href="/admin/webhook-events" className="text-sky-200 text-sm hover:text-white underline">Webhook Events →</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-3 gap-5">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-6">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} mb-4`}>
              <Icon size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
