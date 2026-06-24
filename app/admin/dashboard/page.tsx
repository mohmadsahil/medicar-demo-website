"use client";
import { useEffect, useState, useMemo } from "react";
import {
  Users, Shield, Webhook, ArrowUpRight, CheckCircle2, XCircle,
  RefreshCw, Activity, CalendarDays, Clock, Search, ChevronRight, Trash2,
} from "lucide-react";
import Link from "next/link";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface Stats {
  users: { total: number; verified: number };
  consents: { granted: number; withdrawn: number; expired: number; total: number };
  webhooks: { total: number; last24h: number };
  transactions: { total: number };
  appointments: { total: number };
}

interface WebhookEvent {
  _id: string;
  event: string;
  signatureValid: boolean;
  payload: Record<string, unknown>;
  processedAt: string;
  createdAt: string;
}

interface Transaction {
  _id: string;
  transactionId: string;
  referenceId: string;
  email?: string;
  mobile?: string;
  purposes: string[];
  verifiedAt: string;
  createdAt: string;
}

interface UserRow {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  referenceId?: string;
  createdAt: string;
}

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const EVENT_COLOR: Record<string, string> = {
  "consent.granted":         "bg-green-100 text-green-700",
  "consent.created":         "bg-blue-100 text-blue-700",
  "consent.withdrawn":       "bg-red-100 text-red-700",
  "consent.expired":         "bg-amber-100 text-amber-700",
  "consent.superseded":      "bg-purple-100 text-purple-700",
  "consent.reconfirmed":     "bg-teal-100 text-teal-700",
  "consent.expiry.reminder": "bg-orange-100 text-orange-700",
  "notice.accepted":         "bg-indigo-100 text-indigo-700",
  "notice.rejected":         "bg-rose-100 text-rose-700",
};

function fmt(d: string) {
  return new Date(d).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* ─── Sub-components ───────────────────────────────────────────────────────── */
function StatCard({
  label, value, sub, Icon, color,
}: {
  label: string; value: number | string; sub?: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 shadow-sm">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold text-gray-900 leading-none">{value}</div>
        <div className="text-xs text-gray-500 mt-1">{label}</div>
        {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

/* ─── Webhooks Tab ─────────────────────────────────────────────────────────── */
function WebhooksTab({ events }: { events: WebhookEvent[] }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<WebhookEvent | null>(null);

  const filtered = useMemo(() => {
    if (!q.trim()) return events;
    const lc = q.toLowerCase();
    return events.filter(
      (e) => e.event.includes(lc) || e._id.includes(lc),
    );
  }, [events, q]);

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
          <Search size={14} className="text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter events…"
            className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
          <span className="text-xs text-gray-400">{filtered.length}</span>
        </div>
        <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No events</div>
          ) : (
            filtered.map((e) => (
              <div
                key={e._id}
                onClick={() => setSel(sel?._id === e._id ? null : e)}
                className={`px-5 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors ${sel?._id === e._id ? "bg-sky-50 border-l-2 border-sky-500" : ""}`}
              >
                <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${EVENT_COLOR[e.event] ?? "bg-gray-100 text-gray-600"}`}>
                  {e.event.split(".").slice(-1)[0]}
                </span>
                <span className="text-xs text-gray-700 font-mono flex-1 truncate">{e.event}</span>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${e.signatureValid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                    {e.signatureValid ? "✓" : "✗"}
                  </span>
                  <div className="text-[10px] text-gray-400 mt-0.5">{fmtDate(e.createdAt)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        {sel ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${EVENT_COLOR[sel.event] ?? "bg-gray-100 text-gray-600"}`}>
                {sel.event}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${sel.signatureValid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {sel.signatureValid ? "Signature valid" : "Signature invalid"}
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                ["Processed", fmt(sel.processedAt)],
                ["Received", fmt(sel.createdAt)],
                ["Event ID", sel._id],
              ].map(([l, v]) => (
                <div key={l} className="flex gap-2">
                  <span className="text-gray-400 w-20 shrink-0">{l}</span>
                  <span className="text-gray-800 font-medium font-mono break-all">{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-[11px] font-mono text-gray-600 max-h-52 overflow-y-auto whitespace-pre-wrap">
              {JSON.stringify(sel.payload, null, 2)}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-300 text-sm">
            Select an event
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Postbacks Tab — webhook receive → response flow ──────────────────────── */
function PostbacksTab({ events }: { events: WebhookEvent[] }) {
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!q.trim()) return events;
    const lc = q.toLowerCase();
    return events.filter((e) => e.event.includes(lc) || e._id.includes(lc));
  }, [events, q]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
        <Search size={14} className="text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by event type…"
          className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        <span className="text-xs text-gray-400">{filtered.length}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm">No postback events</div>
      ) : (
        <div className="divide-y divide-gray-50 max-h-[560px] overflow-y-auto">
          {filtered.map((e) => (
            <div key={e._id} className="px-5 py-3 space-y-2">
              {/* Request row — DA → Demo */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                  <span className="text-[9px] font-bold text-sky-600 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded">→ IN</span>
                  <div className="w-px flex-1 bg-gray-200 min-h-[20px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-gray-500">POST /api/consent/webhook</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${EVENT_COLOR[e.event] ?? "bg-gray-100 text-gray-600"}`}>
                      {e.event}
                    </span>
                    <span className="text-[10px] text-gray-400">{fmt(e.createdAt)}</span>
                  </div>
                  {/* Payload preview */}
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === e._id ? null : e._id)}
                    className="text-[10px] text-sky-600 hover:underline mt-0.5"
                  >
                    {expanded === e._id ? "Hide payload ▲" : "Show payload ▼"}
                  </button>
                  {expanded === e._id && (
                    <pre className="mt-1.5 bg-gray-50 rounded-lg p-2.5 text-[10px] font-mono text-gray-600 max-h-36 overflow-y-auto whitespace-pre-wrap">
                      {JSON.stringify(e.payload, null, 2)}
                    </pre>
                  )}
                </div>
              </div>

              {/* Response row — Demo → DA */}
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <span className="text-[9px] font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">← OUT</span>
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold text-green-600">200 OK</span>
                  <code className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-mono">
                    {`{ "received": true, "event": "${e.event}" }`}
                  </code>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${e.signatureValid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                    sig {e.signatureValid ? "✓" : "✗"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Transactions Tab ──────────────────────────────────────────────────────── */
function TransactionsTab({ transactions }: { transactions: Transaction[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return transactions;
    const lc = q.toLowerCase();
    return transactions.filter(
      (t) =>
        t.transactionId?.toLowerCase().includes(lc) ||
        t.referenceId?.toLowerCase().includes(lc) ||
        t.email?.toLowerCase().includes(lc),
    );
  }, [transactions, q]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
        <Search size={14} className="text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by transaction ID, reference or email…"
          className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        <span className="text-xs text-gray-400">{filtered.length}</span>
      </div>
      <div className="overflow-x-auto max-h-[540px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No transactions</div>
        ) : (
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
              <tr>
                {["Transaction ID", "Reference ID", "Email / Mobile", "Purposes", "Verified At"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-gray-700 max-w-[160px] truncate" title={t.transactionId}>{t.transactionId}</td>
                  <td className="px-4 py-3 font-mono text-gray-600 max-w-[160px] truncate" title={t.referenceId}>{t.referenceId}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {t.email && <div className="truncate max-w-[160px]">{t.email}</div>}
                    {t.mobile && <div className="text-gray-400">{t.mobile}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(t.purposes ?? []).slice(0, 3).map((p) => (
                        <span key={p} className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-medium">{p}</span>
                      ))}
                      {(t.purposes ?? []).length > 3 && (
                        <span className="text-gray-400">+{t.purposes.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmt(t.verifiedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ─── Users Tab ────────────────────────────────────────────────────────────── */
function UsersTab({ users }: { users: UserRow[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return users;
    const lc = q.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(lc) ||
        u.email?.toLowerCase().includes(lc) ||
        u.phone?.includes(lc) ||
        u.referenceId?.toLowerCase().includes(lc),
    );
  }, [users, q]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
        <Search size={14} className="text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by name, email, phone or reference…"
          className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        <span className="text-xs text-gray-400">{filtered.length}</span>
      </div>
      <div className="overflow-x-auto max-h-[540px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No users</div>
        ) : (
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
              <tr>
                {["Name", "Email", "Phone", "Role", "Verified", "Reference ID", "Joined"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[140px] truncate">{u.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{u.email || "—"}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono">{u.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${u.role === "admin" ? "bg-purple-50 text-purple-700" : "bg-sky-50 text-sky-700"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.isVerified
                      ? <CheckCircle2 size={14} className="text-green-500" />
                      : <XCircle size={14} className="text-gray-300" />}
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-400 max-w-[160px] truncate">{u.referenceId || "—"}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ─── Main Dashboard ───────────────────────────────────────────────────────── */
type Tab = "webhooks" | "postbacks" | "transactions" | "users";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("webhooks");
  const [stats, setStats] = useState<Stats | null>(null);
  const [webhooks, setWebhooks] = useState<WebhookEvent[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [erasing, setErasing] = useState(false);
  const [eraseConfirm, setEraseConfirm] = useState(false);
  const [eraseResult, setEraseResult] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      const d = await res.json();
      setStats(d.stats);
      setWebhooks(d.recentWebhooks ?? []);
      setTransactions(d.recentTransactions ?? []);
      setUsers(d.recentUsers ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const eraseAll = async () => {
    setErasing(true);
    setEraseResult(null);
    try {
      const res = await fetch("/api/admin/erase", { method: "DELETE" });
      const d = await res.json();
      const total = Object.values(d.deleted as Record<string, number>).reduce((a, b) => a + b, 0);
      setEraseResult(`Deleted ${total} records.`);
      await load();
    } catch {
      setEraseResult("Error — could not erase.");
    } finally {
      setErasing(false);
      setEraseConfirm(false);
    }
  };

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: "webhooks",     label: "Webhook Events",   count: webhooks.length },
    { key: "postbacks",    label: "Postback Flow",    count: webhooks.length },
    { key: "transactions", label: "Transactions",     count: transactions.length },
    { key: "users",        label: "Users",            count: users.length },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-sky-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Activity size={22} />
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-sky-200 text-sm">Real-time overview — webhooks, postbacks & users</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/consent-analytics" className="text-sky-200 text-sm hover:text-white flex items-center gap-1">
                Analytics <ChevronRight size={14} />
              </Link>
              <Link href="/admin/webhook-events" className="text-sky-200 text-sm hover:text-white flex items-center gap-1">
                Webhook Log <ChevronRight size={14} />
              </Link>
              <button
                onClick={load}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
              <button
                onClick={() => { setEraseConfirm(true); setEraseResult(null); }}
                className="flex items-center gap-1.5 bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 size={13} /> Erase All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard
              label="Total Users"
              value={stats.users.total}
              sub={`${stats.users.verified} verified`}
              Icon={Users}
              color="bg-sky-100 text-sky-700"
            />
            <StatCard
              label="Active Consents"
              value={stats.consents.granted}
              sub={`${stats.consents.total} total`}
              Icon={Shield}
              color="bg-green-100 text-green-700"
            />
            <StatCard
              label="Webhook Events"
              value={stats.webhooks.total}
              sub={`${stats.webhooks.last24h} last 24 h`}
              Icon={Webhook}
              color="bg-purple-100 text-purple-700"
            />
            <StatCard
              label="Transactions"
              value={stats.transactions.total}
              Icon={ArrowUpRight}
              color="bg-indigo-100 text-indigo-700"
            />
            <StatCard
              label="Appointments"
              value={stats.appointments.total}
              Icon={CalendarDays}
              color="bg-amber-100 text-amber-700"
            />
          </div>
        )}

        {/* Consent breakdown mini-cards */}
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Granted", value: stats.consents.granted, cls: "bg-green-50 border-green-200 text-green-700" },
              { label: "Withdrawn", value: stats.consents.withdrawn, cls: "bg-red-50 border-red-200 text-red-700" },
              { label: "Expired", value: stats.consents.expired, cls: "bg-amber-50 border-amber-200 text-amber-700" },
            ].map(({ label, value, cls }) => (
              <div key={label} className={`rounded-xl border px-5 py-3 flex items-center justify-between ${cls}`}>
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-xl font-bold">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div>
          <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 w-fit shadow-sm mb-5">
            {TABS.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  tab === key
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 py-16 flex items-center justify-center">
              <Clock size={20} className="text-gray-300 animate-pulse mr-2" />
              <span className="text-gray-400 text-sm">Loading…</span>
            </div>
          ) : (
            <>
              {tab === "webhooks"     && <WebhooksTab events={webhooks} />}
              {tab === "postbacks"    && <PostbacksTab events={webhooks} />}
              {tab === "transactions" && <TransactionsTab transactions={transactions} />}
              {tab === "users"        && <UsersTab users={users} />}
            </>
          )}
        </div>
      </div>

      {/* Erase confirm modal */}
      {eraseConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Erase all data?</h3>
                <p className="text-xs text-gray-500 mt-0.5">Deletes all webhook events, transactions, consent records, audit logs & non-admin users. Cannot be undone.</p>
              </div>
            </div>
            {eraseResult && (
              <p className="text-sm font-medium text-center text-gray-700">{eraseResult}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setEraseConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={eraseAll}
                disabled={erasing}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {erasing ? "Erasing…" : "Yes, erase all"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
