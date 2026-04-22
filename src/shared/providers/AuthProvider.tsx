"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { UserRole } from "@/src/shared/lib/userRole";
import fetchJSON from "@/src/shared/lib/fetchJSON";

export type AuthDTO = {
  userId: string;
  username: string;
  userRole: UserRole;
};

type AuthContextType = {
  user: AuthDTO | undefined;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthDTO | undefined>(undefined);

  useEffect(() => {
    const stored = sessionStorage.getItem("auth");

    if (stored) {
      setUser(JSON.parse(stored));
      return;
    }

    fetchJSON(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/auth`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).then((res) => {
      if (res.status === 200 && res.data) {
        sessionStorage.setItem("auth", JSON.stringify(res.data));
        setUser(res.data as AuthDTO);
      }
    });
  }, []);

  const value = useMemo(() => ({ user }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
