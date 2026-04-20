"use client";

import { useState, useEffect, useCallback } from "react";

type Tab = "contacts" | "applications" | "users";

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  consentId?: string;
  consentUserId?: string;
  consentRecordId?: string;
  revokeUrl?: string;
  createdAt: string;
}

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  resumeName: string;
  message?: string;
  consentId?: string;
  consentUserId?: string;
  consentRecordId?: string;
  revokeUrl?: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  company?: string;
  bio?: string;
  consentId?: string;
  consentUserId?: string;
  consentRecordId?: string;
  revokeUrl?: string;
  createdAt: string;
}

interface AdminData {
  contacts: Contact[];
  applications: Application[];
  users: User[];
}

function ConsentRow({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-gray-400 w-24 flex-shrink-0">{label}:</span>
      {isLink ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
          {value}
        </a>
      ) : (
        <span className="text-gray-600 font-mono break-all">{value}</span>
      )}
    </div>
  );
}

function fmt(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("contacts");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        setData(await res.json());
      } else if (res.status === 401) {
        setAuthed(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/data")
      .then((r) => {
        if (r.ok) {
          setAuthed(true);
          return r.json().then(setData);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setLoginErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setAuthed(true);
        await fetchData();
      } else {
        const d = await res.json();
        setLoginErr(d.error || "Invalid credentials.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setData(null);
    setEmail("");
    setPassword("");
  }

  if (checking) {
    return (
      <div className="min-h-[calc(100vh-9rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-[calc(100vh-9rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-1">Restricted access</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="form-label" htmlFor="a-email">Email</label>
                <input
                  id="a-email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="form-label" htmlFor="a-password">Password</label>
                <input
                  id="a-password"
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {loginErr && (
                <div className="text-red-700 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                  {loginErr}
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
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "contacts", label: "Contact Messages", count: data?.contacts.length ?? 0 },
    { key: "applications", label: "Job Applications", count: data?.applications.length ?? 0 },
    { key: "users", label: "Registered Users", count: data?.users.length ?? 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage submissions and users</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`card text-left transition-all ${
              tab === key ? "ring-2 ring-blue-500 border-blue-200" : "hover:shadow-md"
            }`}
          >
            <p className="text-2xl font-bold text-blue-600 mb-1">{count}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </button>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
            <span className="ml-1.5 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          </button>
        ))}
      </div>

      {loading && !data && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Contacts */}
      {tab === "contacts" && data && (
        <div className="space-y-3">
          {data.contacts.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-12">No contact messages yet.</p>
          )}
          {data.contacts.map((c) => (
            <div key={c._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{c.name}</span>
                    <span className="text-gray-400 text-xs">·</span>
                    <a href={`mailto:${c.email}`} className="text-blue-600 text-sm hover:underline truncate">
                      {c.email}
                    </a>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">{fmt(c.createdAt)}</p>
                </div>
                <button
                  onClick={() => setExpanded(expanded === c._id ? null : c._id)}
                  className="text-xs text-blue-600 hover:underline flex-shrink-0"
                >
                  {expanded === c._id ? "Hide" : "View"}
                </button>
              </div>
              {expanded === c._id && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{c.message}</p>
                  {(c.consentRecordId || c.consentUserId || c.revokeUrl) && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                      {c.consentId && <ConsentRow label="Consent ID" value={c.consentId} />}
                      {c.consentUserId && <ConsentRow label="Consent User" value={c.consentUserId} />}
                      {c.consentRecordId && <ConsentRow label="Record ID" value={c.consentRecordId} />}
                      {c.revokeUrl && <ConsentRow label="Revoke URL" value={c.revokeUrl} isLink />}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Applications */}
      {tab === "applications" && data && (
        <div className="space-y-3">
          {data.applications.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-12">No applications yet.</p>
          )}
          {data.applications.map((a) => (
            <div key={a._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{a.name}</span>
                    <span className="text-gray-400 text-xs">·</span>
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {a.position}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <a href={`mailto:${a.email}`} className="text-blue-600 text-xs hover:underline">
                      {a.email}
                    </a>
                    <span className="text-gray-400 text-xs">{a.phone}</span>
                    <span className="text-gray-400 text-xs">{fmt(a.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setExpanded(expanded === a._id ? null : a._id)}
                  className="text-xs text-blue-600 hover:underline flex-shrink-0"
                >
                  {expanded === a._id ? "Hide" : "View"}
                </button>
              </div>
              {expanded === a._id && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex gap-2 text-xs">
                    <span className="text-gray-500 w-24 flex-shrink-0">Resume file:</span>
                    <span className="text-gray-700 font-medium">{a.resumeName}</span>
                  </div>
                  {a.message && (
                    <div className="flex gap-2 text-xs">
                      <span className="text-gray-500 w-24 flex-shrink-0">Cover note:</span>
                      <span className="text-gray-700 leading-relaxed whitespace-pre-wrap">{a.message}</span>
                    </div>
                  )}
                  {(a.consentRecordId || a.consentUserId || a.revokeUrl) && (
                    <div className="pt-2 border-t border-gray-100 space-y-1.5">
                      {a.consentId && <ConsentRow label="Consent ID" value={a.consentId} />}
                      {a.consentUserId && <ConsentRow label="Consent User" value={a.consentUserId} />}
                      {a.consentRecordId && <ConsentRow label="Record ID" value={a.consentRecordId} />}
                      {a.revokeUrl && <ConsentRow label="Revoke URL" value={a.revokeUrl} isLink />}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {tab === "users" && data && (
        <div className="space-y-3">
          {data.users.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-12">No registered users yet.</p>
          )}
          {data.users.map((u) => (
            <div key={u._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{u.name}</span>
                    {u.role && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        {u.role}
                      </span>
                    )}
                    {u.company && (
                      <span className="text-gray-400 text-xs">{u.company}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <a href={`mailto:${u.email}`} className="text-blue-600 text-xs hover:underline">
                      {u.email}
                    </a>
                    {u.phone && <span className="text-gray-400 text-xs">{u.phone}</span>}
                    <span className="text-gray-400 text-xs">Joined {fmt(u.createdAt)}</span>
                  </div>
                </div>
                {(u.bio || u.consentRecordId || u.revokeUrl) && (
                  <button
                    onClick={() => setExpanded(expanded === u._id ? null : u._id)}
                    className="text-xs text-blue-600 hover:underline flex-shrink-0"
                  >
                    {expanded === u._id ? "Hide" : "Details"}
                  </button>
                )}
              </div>
              {expanded === u._id && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                  {u.bio && <p className="text-sm text-gray-700 leading-relaxed mb-2">{u.bio}</p>}
                  {u.consentId && <ConsentRow label="Consent ID" value={u.consentId} />}
                  {u.consentUserId && <ConsentRow label="Consent User" value={u.consentUserId} />}
                  {u.consentRecordId && <ConsentRow label="Record ID" value={u.consentRecordId} />}
                  {u.revokeUrl && <ConsentRow label="Revoke URL" value={u.revokeUrl} isLink />}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
