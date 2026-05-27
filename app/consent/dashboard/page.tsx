"use client";
import { useEffect, useState } from "react";
import { Shield, Check, X, Clock, AlertTriangle, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useConsent } from "@/contexts/ConsentContext";
import Link from "next/link";

export default function ConsentDashboardPage() {
  const { user, accessToken } = useAuth();
  const { consents, loading, fetchConsents, grant, withdraw } = useConsent();
  const [purposes, setPurposes] = useState<Record<string, { purposeId: string; name: string; description: string; isMandatory: boolean }>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [demoMode] = useState(process.env.NEXT_PUBLIC_DEMO_MODE === "true");

  useEffect(() => {
    if (accessToken) fetchConsents();
    fetch("/api/consent/purposes")
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, { purposeId: string; name: string; description: string; isMandatory: boolean }> = {};
        (d.purposes ?? []).forEach((p: { purposeId: string; name: string; description: string; isMandatory: boolean }) => { map[p.purposeId] = p; });
        setPurposes(map);
      });
  }, [accessToken, fetchConsents]);

  const handleAction = async (purposeId: string, action: "grant" | "withdraw") => {
    setActionLoading(purposeId);
    try {
      if (action === "grant") await grant(purposeId);
      else await withdraw(purposeId);
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Shield size={40} className="text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500">Please <Link href="/auth/login" className="text-sky-600 hover:underline">sign in</Link> to manage your consents.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-sky-700 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={28} />
            <h1 className="text-3xl font-bold">Consent Dashboard</h1>
          </div>
          <p className="text-sky-200 text-sm">Manage your data processing consents under the DPDP Act 2023 (Section 6)</p>
          <div className="flex gap-4 mt-4">
            <Link href="/consent/history" className="text-sky-200 text-sm hover:text-white underline">View Consent History</Link>
            <Link href="/consent/preferences" className="text-sky-200 text-sm hover:text-white underline">Cookie Preferences</Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {demoMode && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-2.5 text-sm text-amber-800">
            <Info size={16} className="shrink-0 mt-0.5" />
            <div>
              <strong>Demo Mode Active:</strong> Toggle consent switches below, then check the webhook event email in the admin panel.
              Each toggle fires a consent event to the webhook handler.
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading consents...</div>
        ) : (
          <div className="space-y-4">
            {Object.entries(purposes).length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <Info size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">No consent purposes found. Run the seed script to populate data.</p>
              </div>
            ) : (
              Object.values(purposes).map((p) => {
                const consentRecord = consents.find((c) => c.purposeId === p.purposeId) ??
                  { purposeId: p.purposeId, status: "pending" as const };
                const isGranted = consentRecord.status === "granted";
                const isLoading = actionLoading === consentRecord.purposeId;

                return (
                  <div key={consentRecord.purposeId} className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{p.name}</h3>
                          {p.isMandatory && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Required</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{p.description}</p>
                        <div className="flex items-center gap-2">
                          {isGranted ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                              <Check size={11} /> Granted
                            </span>
                          ) : consentRecord.status === "withdrawn" ? (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                              <AlertTriangle size={11} /> Withdrawn
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                              <Clock size={11} /> Not granted
                            </span>
                          )}
                          {consentRecord.consentReceiptId && (
                            <span className="text-xs text-gray-400">Receipt: {consentRecord.consentReceiptId}</span>
                          )}
                        </div>
                      </div>

                      {!p.isMandatory && (
                        <div className="shrink-0">
                          {isGranted ? (
                            <button
                              onClick={() => handleAction(consentRecord.purposeId, "withdraw")}
                              disabled={isLoading}
                              className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-60 transition-colors"
                            >
                              <X size={14} /> {isLoading ? "..." : "Withdraw"}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction(consentRecord.purposeId, "grant")}
                              disabled={isLoading}
                              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
                            >
                              <Check size={14} /> {isLoading ? "..." : "Grant"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        <div className="mt-8 bg-sky-50 border border-sky-100 rounded-xl p-5 text-sm text-sky-800">
          <Shield size={16} className="inline mr-2" />
          <strong>Your Rights (DPDP Act 2023):</strong> You have the right to withdraw any non-mandatory consent at any time
          under Section 6(4). Withdrawal does not affect the lawfulness of prior processing. For data access, correction,
          or erasure requests, visit your <Link href="/portal" className="underline">Patient Portal</Link>.
        </div>
      </div>
    </div>
  );
}
