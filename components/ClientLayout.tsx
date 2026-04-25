"use client";

import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

function CmpConfigSetter() {
  const { user } = useAuth();
  useEffect(() => {
    if (user?.referenceId) {
      (window as any).__CMP_CONFIG = { referenceId: user.referenceId };
    }
  }, [user]);
  return null;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CmpConfigSetter />
      <Navbar />
      {children}
    </AuthProvider>
  );
}
