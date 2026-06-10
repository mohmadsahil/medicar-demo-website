"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Play, CheckCircle, XCircle, Shield, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface WebhookEvent {
  _id: string;
  event: string;
  payload: Record<string, unknown>;
  signatureValid: boolean;
  processedAt: string;
  emailSent: boolean;
  errorMessage?: string;
  recipientEmail?: string;
  createdAt: string;
}

export default function WebhookEventsPage() {
  const { user, accessToken } = useAuth();
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);
  const [replayLoading, setReplayLoading] = useState<string | null>(null);
  const [replayResult, setReplayResult] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/webhook-events", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setEvents(data.events ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) load();
  }, [accessToken]);

  const replay = async (event: WebhookEvent) => {
    setReplayLoading(event._id);
    try {
      const res = await fetch("/api/consent/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-event": event.event,
          "x-webhook-signature": process.env.NEXT_PUBLIC_DEMO_MODE === "true"
            ? (event.payload?.signature as string ?? "demo")
            : "",
        },
        body: JSON.stringify(event.payload),
      });
      const data = await res.json();
      setReplayResult((prev) => ({ ...prev, [event._id]: res.ok ? "✅ Replayed" : `❌ ${data.error}` }));
    } catch {
      setReplayResult((prev) => ({ ...prev, [event._id]: "❌ Network error" }));
    } finally {
      setReplayLoading(null);
    }
  };

  if (!user || user.role !== "admin") return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      <div className="text-center">
        <Shield size={40} className="mx-auto mb-3 text-gray-200" />
        <p>Admin access required. <Link href="/" className="text-sky-600 hover:underline">Go home</Link></p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-sky-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Shield size={24} />
              <h1 className="text-2xl font-bold">Webhook Events</h1>
            </div>
            <p className="text-sky-200 text-sm">Consent & notice webhook audit log with replay capability</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/consent-analytics" className="text-sky-200 text-sm hover:text-white underline">Analytics →</Link>
            <button onClick={load} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Demo curl examples */}
        <div className="bg-gray-900 rounded-xl p-5 mb-8 text-sm font-mono text-gray-300 overflow-x-auto">
          <div className="text-gray-500 mb-2"># Test webhook — consent.granted event</div>
          <div className="text-green-400">
            {`curl -X POST http://localhost:3000/api/consent/webhook \\`}<br />
            {`  -H "Content-Type: application/json" \\`}<br />
            {`  -H "x-webhook-event: consent.granted" \\`}<br />
            {`  -H "x-webhook-signature: $WEBHOOK_NOTICE_SECRET" \\`}<br />
            {`  -d '{"id":"evt-001","data":{"referenceId":"DEMO-REF-001","consentId":"CR-AABB1122","purpose":{"name":"Medical Treatment"}},"occurredAt":"${new Date().toISOString()}"}'`}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Event list */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Events ({events.length})</h2>
            </div>
            {loading ? (
              <div className="py-12 text-center text-gray-400">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <Clock size={32} className="mx-auto mb-3 text-gray-200" />
                No webhook events received yet. Send a test curl request above.
              </div>
            ) : (
              <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                {events.map((event) => (
                  <div
                    key={event._id}
                    onClick={() => setSelectedEvent(event)}
                    className={`px-5 py-4 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors ${selectedEvent?._id === event._id ? "bg-sky-50 border-l-2 border-sky-500" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${event.emailSent ? "bg-green-100" : "bg-red-100"}`}>
                      {event.emailSent ? <CheckCircle size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm">{event.event}</div>
                      <div className="text-xs text-gray-400 truncate">{event.recipientEmail ?? "No recipient"}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-xs px-2 py-0.5 rounded-full ${event.signatureValid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {event.signatureValid ? "✓ Valid" : "✗ Invalid"}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(event.createdAt).toLocaleTimeString("en-IN")}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Event detail */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
            {selectedEvent ? (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">{selectedEvent.event}</h3>
                <div className="space-y-2 text-sm mb-5">
                  {[
                    { label: "Email Sent", value: selectedEvent.emailSent ? "Yes" : "No" },
                    { label: "Signature", value: selectedEvent.signatureValid ? "Valid" : "Invalid" },
                    { label: "Recipient", value: selectedEvent.recipientEmail ?? "—" },
                    { label: "Processed At", value: new Date(selectedEvent.processedAt).toLocaleString("en-IN") },
                    ...(selectedEvent.errorMessage ? [{ label: "Error", value: selectedEvent.errorMessage }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-2">
                      <span className="text-gray-500 w-24 shrink-0">{label}:</span>
                      <span className="text-gray-900 font-medium text-xs">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs font-mono text-gray-600 max-h-40 overflow-y-auto">
                  {JSON.stringify(selectedEvent.payload, null, 2)}
                </div>

                <button
                  onClick={() => replay(selectedEvent)}
                  disabled={replayLoading === selectedEvent._id}
                  className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
                >
                  <Play size={14} />
                  {replayLoading === selectedEvent._id ? "Replaying..." : "Replay Event"}
                </button>

                {replayResult[selectedEvent._id] && (
                  <div className="mt-2 text-sm text-center font-medium">{replayResult[selectedEvent._id]}</div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-300 text-sm">
                Click an event to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
