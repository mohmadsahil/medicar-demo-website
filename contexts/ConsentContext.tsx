"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface ConsentRecord {
  purposeId: string;
  status: "granted" | "withdrawn" | "expired" | "pending";
  grantedAt?: string;
  consentReceiptId?: string;
}

interface ConsentContextValue {
  consents: ConsentRecord[];
  loading: boolean;
  fetchConsents: () => Promise<void>;
  grant: (purposeId: string) => Promise<void>;
  withdraw: (purposeId: string) => Promise<void>;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConsents = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await fetch("/api/consent/my-consents", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConsents(data.consents.map((c: { purposeId: string; consentRecord: ConsentRecord | null }) => ({
          ...(c.consentRecord ?? { status: "pending" as const }),
          purposeId: c.purposeId,
        })));
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const grant = async (purposeId: string) => {
    if (!accessToken) return;
    await fetch("/api/consent/grant", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ purposeId }),
    });
    await fetchConsents();
  };

  const withdraw = async (purposeId: string) => {
    if (!accessToken) return;
    await fetch("/api/consent/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ purposeId }),
    });
    await fetchConsents();
  };

  return (
    <ConsentContext.Provider value={{ consents, loading, fetchConsents, grant, withdraw }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be inside ConsentProvider");
  return ctx;
}
