"use client";
import { useEffect, useState } from "react";
import { Shield, Clock, Check, X, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface AuditEntry {
  _id: string;
  action: string;
  purposeId?: string;
  consentReceiptId?: string;
  performedBy: string;
  createdAt: string;
  metadata: Record<string, unknown>;
}

const actionConfig: Record<string, { icon: typeof Check; color: string; label: string }> = {
  "consent.granted": { icon: Check, color: "text-green-600 bg-green-50", label: "Consent Granted" },
  "consent.withdrawn": { icon: X, color: "text-red-600 bg-red-50", label: "Consent Withdrawn" },
};

export default function ConsentHistoryPage() {
  const { user, accessToken } = useAuth();
  const [history, setHistory] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    fetch("/api/consent/history", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => r.json())
      .then((d) => setHistory(d.history ?? []))
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Please <Link href="/auth/login" className="text-sky-600 mx-1 hover:underline">sign in</Link> to view consent history.
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-sky-700 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={26} />
            <h1 className="text-3xl font-bold">Consent History</h1>
          </div>
          <p className="text-sky-200 text-sm">Complete audit trail of consent actions — DPDP Act 2023 Section 8(6)</p>
          <Link href="/consent/dashboard" className="text-sky-200 text-sm hover:text-white underline mt-2 inline-block">← Back to Dashboard</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <RefreshCw size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No consent history yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 text-sm font-medium text-gray-500 grid grid-cols-4">
              <span>Action</span>
              <span>Purpose</span>
              <span>Receipt ID</span>
              <span>Date & Time</span>
            </div>
            {history.map((entry) => {
              const cfg = actionConfig[entry.action] ?? { icon: Shield, color: "text-gray-600 bg-gray-50", label: entry.action };
              const Icon = cfg.icon;
              return (
                <div key={entry._id} className="px-6 py-4 border-b border-gray-50 last:border-0 grid grid-cols-4 gap-4 items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cfg.color}`}>
                      <Icon size={13} />
                    </div>
                    <span className="font-medium text-gray-900">{cfg.label}</span>
                  </div>
                  <span className="text-gray-600">{entry.purposeId ?? "—"}</span>
                  <span className="text-gray-400 text-xs font-mono">{entry.consentReceiptId ?? "—"}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(entry.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
