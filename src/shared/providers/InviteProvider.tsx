"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAppSocket } from "@/src/shared/providers/AppSocketProvider";
import { PendingInvite, WsInbound } from "@/src/shared/types/ws";

type InviteToast = {
  id: string;
  inviteType: string;
  fromUsername: string;
  roomName: string | null;
  fromAvatarUrl: string | null;
};

type AcceptedToast = {
  id: string;
  inviteType: string;
  username: string;
  avatarUrl: string | null;
};

type InviteContextType = {
  pendingCount: number;
  pendingInvites: PendingInvite[];
  inviteToast: InviteToast | null;
  acceptedToast: AcceptedToast | null;
  setPendingInvites: React.Dispatch<React.SetStateAction<PendingInvite[]>>;
  clearInviteToast: () => void;
  clearAcceptedToast: () => void;
};

const InviteContext = createContext<InviteContextType | null>(null);

export function InviteProvider({ children }: { children: React.ReactNode }) {
  const { subscribe } = useAppSocket();

  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [inviteToast, setInviteToast] = useState<InviteToast | null>(null);
  const [acceptedToast, setAcceptedToast] = useState<AcceptedToast | null>(
    null,
  );

  useEffect(() => {
    return subscribe((data: WsInbound) => {
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
        return;
      }

      if (data.type === "INVITE_ACCEPTED") {
        setAcceptedToast({
          id: `${data.inviteType}-${data.username}-${Date.now()}`,
          inviteType: data.inviteType,
          username: data.username,
          avatarUrl: data.avatarUrl,
        });
      }
    });
  }, [subscribe]);

  useEffect(() => {
    if (!inviteToast) return;
    const timer = window.setTimeout(() => setInviteToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [inviteToast]);

  useEffect(() => {
    if (!acceptedToast) return;
    const timer = window.setTimeout(() => setAcceptedToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [acceptedToast]);

  const value = useMemo(
    () => ({
      pendingCount: pendingInvites.length,
      pendingInvites,
      inviteToast,
      acceptedToast,
      setPendingInvites,
      clearInviteToast: () => setInviteToast(null),
      clearAcceptedToast: () => setAcceptedToast(null),
    }),
    [pendingInvites, inviteToast, acceptedToast],
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
