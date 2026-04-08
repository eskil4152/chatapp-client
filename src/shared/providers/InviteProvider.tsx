"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAppSocket } from "./AppSocketProvider";
import getPendingInvites from "@/src/features/invites/api/getPendingInvites";

type InviteContextType = {
  pendingCount: number;
  setPendingCount: (count: number) => void;
};

const InviteContext = createContext<InviteContextType | null>(null);

export function InviteProvider({ children }: { children: React.ReactNode }) {
  const { subscribe } = useAppSocket();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    void getPendingInvites().then(({ status, data }) => {
      if (status === 200 && Array.isArray(data)) {
        setPendingCount(data.length);
      }
    });
  }, []);

  useEffect(() => {
    return subscribe((data) => {
      if (data.type === "INVITE_RECEIVED") {
        setPendingCount((prev) => prev + 1);
      }
    });
  }, [subscribe]);

  return (
    <InviteContext.Provider value={{ pendingCount, setPendingCount }}>
      {children}
    </InviteContext.Provider>
  );
}

export function useInvites() {
  const ctx = useContext(InviteContext);
  if (!ctx) throw new Error("useInvites must be used within InviteProvider");
  return ctx;
}
