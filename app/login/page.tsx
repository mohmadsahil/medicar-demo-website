"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Mode = "login" | "signup" | "forgot";

export default function LoginPage() {
  const { user, loading, login, register } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", consentId: "" });
  const [errors, setErrors] = useState<Partial<typeof form & { general: string }>>({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/profile");
  }, [user, loading, router]);

  function validate(): boolean {
    const e: typeof errors = {};

    if (mode === "signup" && !form.name.trim()) e.name = "Full name is required.";

    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Invalid email address.";
    }

    if (mode !== "forgot") {
      if (!form.password) {
        e.password = "Password is required.";
      } else if (mode === "signup" && form.password.length < 8) {
        e.password = "Password must be at least 8 characters.";
      }
      if (mode === "signup" && form.password !== form.confirm) {
        e.confirm = "Passwords do not match.";
      }
    }

    if (mode === "signup" && !form.consentId.trim()) {
      e.consentId = "Consent ID is required.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});

    try {
      if (mode === "forgot") {
        setSuccess(`If an account exists for ${form.email}, a reset link has been sent.`);
        return;
      }

      if (mode === "login") {
        const err = await login(form.email, form.password);
        if (err) {
          setErrors({ general: err });
        } else {
          router.push("/profile");
        }
      } else {
        const err = await register(form.name, form.email, form.password, form.consentId);
        if (err) {
          setErrors({ general: err });
        } else {
          router.push("/profile");
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(m: Mode) {
    setMode(m);
    setErrors({});
    setSuccess("");
    setForm({ name: "", email: "", password: "", confirm: "", consentId: "" });
  }

  const titles: Record<Mode, string> = {
    login: "Welcome back",
    signup: "Create an account",
    forgot: "Reset your password",
  };

  const subtitles: Record<Mode, string> = {
    login: "Sign in to your demo account",
    signup: "Fill in the details below to get started",
    forgot: "Enter your email and we will send a reset link",
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-9rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-9rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-blue-600">
            demo
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">{titles[mode]}</h1>
          <p className="text-gray-500 text-sm mt-1">{subtitles[mode]}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {success ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">{success}</p>
              <button
                onClick={() => { setSuccess(""); switchMode("login"); }}
                className="mt-6 btn-primary"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {mode === "signup" && (
                <div>
                  <label className="form-label" htmlFor="l-name">Full Name</label>
                  <input
                    id="l-name"
                    type="text"
                    className={`form-input ${errors.name ? "border-red-400" : ""}`}
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    autoComplete="name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="form-label" htmlFor="l-email">Email Address</label>
                <input
                  id="l-email"
                  type="email"
                  className={`form-input ${errors.email ? "border-red-400" : ""}`}
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  autoComplete="email"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {mode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="form-label mb-0" htmlFor="l-password">Password</label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="l-password"
                      type={showPassword ? "text" : "password"}
                      className={`form-input pr-10 ${errors.password ? "border-red-400" : ""}`}
                      placeholder={mode === "signup" ? "Minimum 8 characters" : "Enter your password"}
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="form-label" htmlFor="l-consent">Consent ID <span className="text-red-500">*</span></label>
                  <input
                    id="l-consent"
                    type="text"
                    className={`form-input font-mono text-sm ${errors.consentId ? "border-red-400" : ""}`}
                    placeholder="Enter your Digital Anumati consent ID"
                    value={form.consentId}
                    onChange={(e) => setForm((f) => ({ ...f, consentId: e.target.value }))}
                  />
                  {errors.consentId && <p className="text-red-500 text-xs mt-1">{errors.consentId}</p>}
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="form-label" htmlFor="l-confirm">Confirm Password</label>
                  <input
                    id="l-confirm"
                    type={showPassword ? "text" : "password"}
                    className={`form-input ${errors.confirm ? "border-red-400" : ""}`}
                    placeholder="Re-enter your password"
                    value={form.confirm}
                    onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                    autoComplete="new-password"
                  />
                  {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
                </div>
              )}

              {errors.general && (
                <div className="text-red-700 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>

        {!success && (
          <p className="text-center text-sm text-gray-500 mt-6">
            {mode === "login" ? (
              <>
                Do not have an account?{" "}
                <button onClick={() => switchMode("signup")} className="text-blue-600 font-medium hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => switchMode("login")} className="text-blue-600 font-medium hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
