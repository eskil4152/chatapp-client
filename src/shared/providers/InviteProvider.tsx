"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAppSocket } from "./AppSocketProvider";
import getPendingInvites from "@/src/features/invites/api/getPendingInvites";
import { PendingInvite } from "@/src/shared/types/ws";

type InviteToast = {
  id: string;
  inviteType: string;
  fromUsername: string;
  roomName: string | null;
  fromAvatarUrl: string | null;
};

type InviteContextType = {
  pendingCount: number;
  pendingInvites: PendingInvite[];
  inviteToast: InviteToast | null;
  setPendingInvites: React.Dispatch<React.SetStateAction<PendingInvite[]>>;
  clearInviteToast: () => void;
};

const InviteContext = createContext<InviteContextType | null>(null);

export function InviteProvider({ children }: { children: React.ReactNode }) {
  const { subscribe } = useAppSocket();

  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [inviteToast, setInviteToast] = useState<InviteToast | null>(null);

  async function refreshPendingInvites() {
    const { status, data } = await getPendingInvites();

    if (status === 200 && Array.isArray(data)) {
      setPendingInvites(data);
    }
  }

  useEffect(() => {
    return subscribe((data) => {
      if (data.type === "PENDING_INVITES") {
        setPendingInvites(data.invites);
        return;
      }

      if (data.type === "INVITE_RECEIVED") {
        setInviteToast({
          id: data.id,
          inviteType: data.inviteType,
          fromUsername: data.fromUsername,
          roomName: data.roomName,
          fromAvatarUrl: data.fromAvatarUrl,
        });

        void refreshPendingInvites();
        return;
      }

      if (data.type === "INVITE_ACCEPTED") {
        return;
      }
    });
  }, [subscribe]);

  useEffect(() => {
    if (!inviteToast) return;

    const timer = window.setTimeout(() => {
      setInviteToast(null);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [inviteToast]);

  const value = useMemo(
    () => ({
      pendingCount: pendingInvites.length,
      pendingInvites,
      inviteToast,
      setPendingInvites,
      clearInviteToast: () => setInviteToast(null),
    }),
    [pendingInvites, inviteToast],
  );

  return (
    <InviteContext.Provider value={value}>{children}</InviteContext.Provider>
  );
}

export function useInvites() {
  const ctx = useContext(InviteContext);
  if (!ctx) throw new Error("useInvites must be used within InviteProvider");
  return ctx;
}
