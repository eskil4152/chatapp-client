"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAppSocket } from "./AppSocketProvider";

type FriendPresenceContextType = {
  isOnline: (userId: string) => boolean;
};

const FriendPresenceContext = createContext<FriendPresenceContextType | null>(null);

export function FriendPresenceProvider({ children }: { children: React.ReactNode }) {
  const { subscribe } = useAppSocket();
  const onlineIds = useRef(new Set<string>());
  const [, rerender] = useState(0);

  useEffect(() => {
    return subscribe((data) => {
      if (data.type !== "FRIEND_PRESENCE") return;
      if (data.online) onlineIds.current.add(data.userId);
      else onlineIds.current.delete(data.userId);
      rerender((n) => n + 1);
    });
  }, [subscribe]);

  const isOnline = useCallback((id: string) => onlineIds.current.has(id), []);

  return (
    <FriendPresenceContext.Provider value={{ isOnline }}>
      {children}
    </FriendPresenceContext.Provider>
  );
}

export function useFriendPresence() {
  const ctx = useContext(FriendPresenceContext);
  if (!ctx) throw new Error("useFriendPresence must be used within FriendPresenceProvider");
  return ctx;
}
