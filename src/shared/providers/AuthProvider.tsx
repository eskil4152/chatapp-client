"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { SiteRole } from "@/src/shared/lib/siteRole";
import fetchJSON from "@/src/shared/lib/fetchJSON";

type AuthContextType = {
  siteRole: SiteRole | undefined;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [siteRole, setSiteRole] = useState<SiteRole | undefined>(undefined);

  useEffect(() => {
    const stored = sessionStorage.getItem("siteRole") as SiteRole | null;
    if (stored) {
      setSiteRole(stored);
      return;
    }

    fetchJSON(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/auth`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).then((res) => {
      if (res.status === 200 && typeof res.data === "string") {
        sessionStorage.setItem("siteRole", res.data);
        setSiteRole(res.data as SiteRole);
      }
    });
  }, []);

  const value = useMemo(() => ({ siteRole }), [siteRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}