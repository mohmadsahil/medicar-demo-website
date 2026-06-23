"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  dob?: string | null;
  gender?: string | null;
  isVerified?: boolean;
  referenceId?: string | null;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setReferenceId = (u: User | null) => {
    if (u?.email) {
      localStorage.setItem("da_reference_id", u.email);
      localStorage.setItem("da_reference_name", "email");
    } else if (u?.phone) {
      localStorage.setItem("da_reference_id", u.phone);
      localStorage.setItem("da_reference_name", "phone");
    } else {
      localStorage.removeItem("da_reference_id");
      localStorage.removeItem("da_reference_name");
    }
  };

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);
        setUser(data.user);
        setReferenceId(data.user);
      } else {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("da_reference_id");
        localStorage.removeItem("da_reference_name");
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = (token: string, userData: User) => {
    setAccessToken(token);
    setUser(userData);
    setReferenceId(userData);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("da_reference_id");
    localStorage.removeItem("da_reference_name");
    try { sessionStorage.removeItem("da_transaction_id"); } catch {}
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, loading, login, logout, refreshAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
