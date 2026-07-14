"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Phone, Mail, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Step = "identifier" | "otp";
type IdType = "email" | "phone";

function LoginContent() {
  const [idType, setIdType] = useState<IdType>("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("identifier");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/portal";
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, identifierType: idType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send OTP");
      setStep("otp");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, identifierType: idType, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Invalid OTP");

      if (data.requiresProfile) {
        router.push(`/auth/complete-profile?token=${data.tempToken}`);
        return;
      }

      login(data.accessToken, data.user);
      router.push(redirect);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white font-bold">M+</div>
            <span className="font-bold text-gray-900 text-lg">MediCare Plus</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in or create your patient account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {step === "identifier" ? (
            <>
              {/* Tab switcher */}
              <div className="flex rounded-lg border border-gray-200 p-1 mb-6">
                {(["email", "phone"] as IdType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setIdType(t); setIdentifier(""); setError(""); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors ${idType === t ? "bg-sky-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {t === "email" ? <Mail size={14} /> : <Phone size={14} />}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <form onSubmit={requestOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {idType === "email" ? "Email Address" : "Mobile Number (India)"}
                  </label>
                  <input
                    type={idType === "email" ? "email" : "tel"}
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={idType === "email" ? "you@example.com" : "9876543210"}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                {error && <div className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</div>}
                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-xs leading-relaxed">
                    I consent under the DPDP Act, 2023 to Anumati Health
                    processing my contact and OTP data for authentication and
                    appointments
                  </span>
                </label>

                <div>
                  <button
                    type="submit"
                    disabled={loading || !agreed}
                    da-trigger="456534a9-6ad2-4243-ab8c-18d12435bad5"
                    className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
                  >
                    {loading ? "Sending..." : "Send OTP"} <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div className="text-center mb-5">
                <div className="text-sm text-gray-500">OTP sent to</div>
                <div className="font-semibold text-gray-900">{identifier}</div>
                {demoMode && (
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-xs text-amber-800">
                    Demo mode: use OTP <strong>123456</strong>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter 6-digit OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="• • • • • •"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              {error && <div className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</div>}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
              >
                {loading ? "Verifying..." : "Verify & Sign In"} <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => { setStep("identifier"); setOtp(""); setError(""); }}
                className="w-full text-center text-sm text-sky-600 hover:underline"
              >
                ← Change {idType === "email" ? "email" : "number"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <Shield size={11} /> DPDP Act 2023 compliant · Your data is protected
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
