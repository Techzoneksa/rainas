"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const DEMO_EMAIL = "raina@raina.com";
const DEMO_PASSWORD = "Rs2060@";
const DEMO_USER_ID = "usr_01";
const DEMO_DISPLAY_NAME = "عميل رأينا";
const AUTH_KEY = "raina_demo_session";

export interface DemoSession {
  userId: string;
  displayName: string;
  loginMethod: "email" | "otp";
  email?: string;
  phone?: string;
}

interface AuthContextValue {
  session: DemoSession | null;
  isLoggedIn: boolean;
  loginWithEmail: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  loginWithOtp: (phone: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadSession(): DemoSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

function saveSession(session: DemoSession): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

function clearSession(): void {
  localStorage.removeItem(AUTH_KEY);
}

const EMPTY_EMAIL_RESULT = { ok: false as const, error: "" };

function noopLoginWithEmail(): { ok: true } | { ok: false; error: string } {
  return EMPTY_EMAIL_RESULT;
}

function noopLoginWithOtp(_phone: string) {}
function noopLogout() {}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setHydrated(true);
  }, []);

  const loginWithEmail = useCallback(
    (email: string, password: string): { ok: true } | { ok: false; error: string } => {
      if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        return { ok: false as const, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
      }
      const s: DemoSession = {
        userId: DEMO_USER_ID,
        displayName: DEMO_DISPLAY_NAME,
        loginMethod: "email",
        email,
      };
      saveSession(s);
      setSession(s);
      return { ok: true as const };
    },
    [],
  );

  const loginWithOtp = useCallback((phone: string) => {
    const s: DemoSession = {
      userId: DEMO_USER_ID,
      displayName: DEMO_DISPLAY_NAME,
      loginMethod: "otp",
      phone,
    };
    saveSession(s);
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={
        hydrated
          ? { session, isLoggedIn: !!session, loginWithEmail, loginWithOtp, logout }
          : { session: null, isLoggedIn: false, loginWithEmail: noopLoginWithEmail, loginWithOtp: noopLoginWithOtp, logout: noopLogout }
      }
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
