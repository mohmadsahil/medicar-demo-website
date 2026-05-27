"use client";
import { useState } from "react";
import { Shield, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const COOKIE_TYPES = [
  { key: "necessary", label: "Strictly Necessary", desc: "Required for the website to function. Cannot be disabled.", required: true },
  { key: "functional", label: "Functional", desc: "Enables enhanced functionality and personalization.", required: false },
  { key: "analytics", label: "Analytics", desc: "Helps us understand how visitors use the website.", required: false },
  { key: "marketing", label: "Marketing", desc: "Used to deliver relevant advertisements.", required: false },
];

export default function ConsentPreferencesPage() {
  const { accessToken } = useAuth();
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false, functional: false });
  const [saved, setSaved] = useState(false);

  const save = async () => {
    await fetch("/api/consent/cookie-preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
      body: JSON.stringify(prefs),
    });
    localStorage.setItem("cookie-consent", "custom");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-sky-700 text-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={26} />
            <h1 className="text-3xl font-bold">Cookie & Privacy Preferences</h1>
          </div>
          <p className="text-sky-200 text-sm">Manage how MediCare Plus uses cookies on your device</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        {COOKIE_TYPES.map(({ key, label, desc, required }) => (
          <div key={key} className="bg-white rounded-xl border border-gray-100 p-6 flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{label}</h3>
                {required && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Always Active</span>}
              </div>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
            <div
              onClick={() => !required && setPrefs((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))}
              className={`w-12 h-6 rounded-full transition-colors cursor-pointer shrink-0 flex items-center px-0.5 ${
                required || prefs[key as keyof typeof prefs]
                  ? "bg-sky-600"
                  : "bg-gray-200"
              } ${required ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                required || prefs[key as keyof typeof prefs] ? "translate-x-6" : "translate-x-0"
              }`} />
            </div>
          </div>
        ))}

        <button
          onClick={save}
          className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-3.5 rounded-xl font-semibold hover:bg-sky-700 transition-colors"
        >
          {saved ? <><Check size={16} /> Saved!</> : "Save Preferences"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Preferences saved under DPDP Act 2023, Section 5. Strictly necessary cookies cannot be disabled as they are required for website security and functionality.
        </p>
      </div>
    </div>
  );
}
