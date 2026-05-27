"use client";
import { useState, useEffect } from "react";
import { X, Shield } from "lucide-react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const pref = localStorage.getItem("cookie-consent");
    if (!pref) setVisible(true);
  }, []);

  const accept = (all: boolean) => {
    localStorage.setItem("cookie-consent", all ? "all" : "necessary");
    setVisible(false);
    fetch("/api/consent/cookie-preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analytics: all, marketing: all, functional: all }),
    }).catch(() => {});
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl p-4 sm:p-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-start gap-3 flex-1">
          <Shield size={20} className="text-sky-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-gray-900 text-sm mb-1">Cookie & Privacy Notice</div>
            <p className="text-xs text-gray-600 leading-relaxed">
              MediCare Plus uses cookies to improve your experience. Under the{" "}
              <strong>DPDP Act 2023 (Section 5)</strong>, we are required to inform you about
              data collection. Strictly necessary cookies are always active.{" "}
              <Link href="/privacy-policy" className="text-sky-600 underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => accept(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Necessary Only
          </button>
          <button
            onClick={() => accept(true)}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700"
          >
            Accept All
          </button>
          <button onClick={() => setVisible(false)} className="p-2 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
