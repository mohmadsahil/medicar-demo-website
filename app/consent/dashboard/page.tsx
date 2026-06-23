"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function ConsentDashboardPage() {
  const { user } = useAuth();
  const REFERENCE_ID = user?.referenceId ?? null;

  return <div id="consent-detail-root" data-reference-id={REFERENCE_ID}></div>;
}
