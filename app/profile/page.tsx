"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type ConsentKey =
  | "terms"
  | "privacy"
  | "marketing"
  | "analytics"
  | "thirdParty";

const consentOptions: {
  key: ConsentKey;
  label: string;
  desc: string;
  required?: boolean;
}[] = [
  {
    key: "terms",
    label: "Terms and Conditions",
    desc: "I agree to the Terms and Conditions of service.",
    required: true,
  },
  {
    key: "privacy",
    label: "Privacy Policy",
    desc: "I agree to the collection and processing of my personal data as described in the Privacy Policy.",
    required: true,
  },
  {
    key: "marketing",
    label: "Marketing Communications",
    desc: "I consent to receive promotional emails, newsletters, and product updates.",
  },
  {
    key: "analytics",
    label: "Analytics and Performance",
    desc: "I allow usage of analytics cookies to improve the service.",
  },
  {
    key: "thirdParty",
    label: "Third-Party Integrations",
    desc: "I consent to sharing anonymised data with trusted third-party partners.",
  },
];

export default function ProfilePage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    phone: "",
    role: "",
    company: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [consents, setConsents] = useState<Record<ConsentKey, boolean>>({
    terms: true,
    privacy: true,
    marketing: false,
    analytics: true,
    thirdParty: false,
  });
  const [consentSaved, setConsentSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setDraft({
        name: user.name || "",
        phone: user.phone || "",
        role: user.role || "",
        company: user.company || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  async function saveProfile() {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const data = await res.json();
        setSaveError(data.error || "Failed to save.");
        return;
      }
      await refreshUser();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function toggleConsent(key: ConsentKey) {
    if (consentOptions.find((c) => c.key === key)?.required) return;
    setConsents((c) => ({ ...c, [key]: !c[key] }));
    setConsentSaved(false);
  }

  function saveConsents() {
    setConsentSaved(true);
    setTimeout(() => setConsentSaved(false), 3000);
  }

  if (loading || !user) {
    return (
      <div className="min-h-[calc(100vh-9rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your profile and privacy preferences.
        </p>
      </div>

      {/* Profile card */}
      <section className="card mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold select-none uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">
                {user.role
                  ? `${user.role}${user.company ? ` at ${user.company}` : ""}`
                  : user.email}
              </p>
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn-secondary text-sm py-2 px-4"
            >
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  value={draft.name}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input
                  className="form-input"
                  value={draft.phone}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, phone: e.target.value }))
                  }
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="form-label">Role / Title</label>
                <input
                  className="form-input"
                  value={draft.role}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, role: e.target.value }))
                  }
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="form-label">Company</label>
                <input
                  className="form-input"
                  value={draft.company}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, company: e.target.value }))
                  }
                  placeholder="Acme Corp"
                />
              </div>
            </div>
            <div>
              <label className="form-label">Bio</label>
              <textarea
                className="form-input resize-none"
                rows={3}
                value={draft.bio}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, bio: e.target.value }))
                }
                placeholder="Tell us a little about yourself"
              />
            </div>
            {saveError && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {saveError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="btn-primary disabled:opacity-60 flex items-center gap-2"
              >
                {saving && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {[
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone || "Not set" },
              { label: "Company", value: user.company || "Not set" },
              { label: "Member Since", value: joinedDate },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">
                  {label}
                </p>
                <p className="text-gray-900 font-medium">{value}</p>
              </div>
            ))}
            {user.bio && (
              <div className="sm:col-span-2">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">
                  Bio
                </p>
                <p className="text-gray-700">{user.bio}</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Consent section */}
      {(window as any)?.__CMP_CONSENT?.referenceId && (
        <section className="card mb-8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-semibold text-gray-900">
              Privacy Preferences
            </h2>
            {/* {consentSaved && (
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )} */}
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Manage how your data is used. Required consents cannot be revoked
            while you hold an active account.
          </p>

          <div className="space-y-3" id="consent-detail-root"></div>
        </section>
      )}

      {/* Danger zone */}
      <section className="card border-red-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Sign Out</h2>
        <p className="text-sm text-gray-500 mb-4">
          Sign out of your account on this device.
        </p>
        <button
          onClick={logout}
          className="px-5 py-2.5 text-sm font-semibold text-red-600 border border-red-300 hover:bg-red-50 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </section>
    </div>
  );
}
