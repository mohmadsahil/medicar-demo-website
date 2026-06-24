"use client";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle } from "lucide-react";

// Read transactionId from window — set by Anumati widget after consent capture
// or after existing consent is loaded from server (consentState.transactionId)
function getConsentTransactionId(): string | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & Record<string, unknown>;
  return (
    (w["daTransactionId"] as string) ||
    ((w["Anumati"] as Record<string, unknown>)?.["transactionId"] as string) ||
    (w["_da_transaction_id"] as string) ||
    sessionStorage.getItem("da_transaction_id") ||
    null
  );
}

function CompleteProfileContent() {
  const searchParams = useSearchParams();
  const tempToken = searchParams.get("token") ?? "";
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: "", dob: "", gender: "" });
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [txWarning, setTxWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tempToken) { router.replace("/auth/login"); return; }

    const applyTid = (tid: string) => {
      setTransactionId(tid);
      setTxWarning(false);
    };

    // 1. Already set on window (sync)
    const existing = getConsentTransactionId();
    if (existing) { applyTid(existing); return; }

    setTxWarning(true);

    // 2. Listen for widget event (fires when user completes consent)
    const onDaTransaction = (e: Event) => {
      const tid = (e as CustomEvent<{ transactionId: string }>).detail?.transactionId;
      if (tid) applyTid(tid);
    };
    window.addEventListener("da:transaction", onDaTransaction);

    // 3. Poll as fallback (widget may not fire event if already completed before mount)
    const interval = setInterval(() => {
      const tid = getConsentTransactionId();
      if (tid) { applyTid(tid); clearInterval(interval); }
    }, 500);

    return () => {
      clearInterval(interval);
      window.removeEventListener("da:transaction", onDaTransaction);
    };
  }, [tempToken, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }

    const tid = transactionId ?? getConsentTransactionId();
    console.log("[complete-profile] transactionId state:", transactionId, "window.daTransactionId:", (window as any).daTransactionId, "resolved tid:", tid);
    if (!tid) {
      setError("Consent transaction not found. Please complete the consent form before submitting.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({
          ...form,
          consentedPurposes: ["core-treatment", "appointment-mgmt"],
          transactionId: tid,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to complete profile");
      try { sessionStorage.removeItem("da_transaction_id"); } catch {}
      try { delete (window as any).daTransactionId; } catch {}
      login(data.accessToken, data.user);
      router.push("/portal");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">M+</div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-500 mt-1 text-sm">One-time setup to personalize your care</p>
        </div>

        {txWarning && !transactionId && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2 text-sm text-amber-800">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>Consent transaction not detected. Please ensure you have completed the consent form before submitting.</span>
          </div>
        )}

        {transactionId && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-xs text-green-700 font-mono truncate">
            ✓ Consent transaction: {transactionId}
          </div>
        )}

        <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</div>}

          {/* suppressHydrationWarning: DA consent widget injects a label wrapper on the client */}
          <div suppressHydrationWarning>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 text-white py-3.5 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
            >
              {loading ? "Creating account..." : "Create Account & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <CompleteProfileContent />
    </Suspense>
  );
}
