"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { SessionUser } from "@/services/auth";

interface AuthContextValue {
  user: SessionUser | null;
  // True until the session has been read from localStorage. While loading,
  // `user === null` does NOT mean "logged out", just "not checked yet".
  loading: boolean;
  login: (user: SessionUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "recetasapp_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore the session from localStorage on first mount.
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw) as SessionUser);
      } catch {
        setUser(null);
      }
    }
    // Session has now been resolved (whether found or not).
    setLoading(false);
  }, []);

  const login = (sessionUser: SessionUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
