"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAppSocket } from "./AppSocketProvider";
import { OnlineFriend } from "@/src/shared/types/ws";

type FriendPresenceContextType = {
  onlineFriends: OnlineFriend[];
  isOnline: (userId: string) => boolean;
};

const FriendPresenceContext = createContext<FriendPresenceContextType | null>(
  null,
);

export function FriendPresenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { subscribe } = useAppSocket();
  const [friendsMap, setFriendsMap] = useState<Map<string, OnlineFriend>>(
    new Map(),
  );

  useEffect(() => {
    return subscribe((data) => {
      if (data.type === "FRIEND_SNAPSHOT") {
        const next = new Map<string, OnlineFriend>();
        for (const friend of data.friends) {
          next.set(friend.userId, friend);
        }
        setFriendsMap(next);
        return;
      }

      if (data.type !== "FRIEND_PRESENCE") return;

      setFriendsMap((prev) => {
        const next = new Map(prev);
        const existing = next.get(data.userId);

        next.set(data.userId, {
          userId: data.userId,
          username: data.username ?? existing?.username ?? "",
          avatarUrl: data.avatarUrl ?? existing?.avatarUrl ?? null,
          online: data.online,
        });

        return next;
      });
    });
  }, [subscribe]);

  const onlineFriends = useMemo(
    () => Array.from(friendsMap.values()).filter((friend) => friend.online),
    [friendsMap],
  );

  const value = useMemo(
    () => ({
      onlineFriends,
      isOnline: (userId: string) => friendsMap.get(userId)?.online === true,
    }),
    [onlineFriends, friendsMap],
  );

  return (
    <FriendPresenceContext.Provider value={value}>
      {children}
    </FriendPresenceContext.Provider>
  );
}

export function useFriendPresence() {
  const ctx = useContext(FriendPresenceContext);
  if (!ctx) {
    throw new Error(
      "useFriendPresence must be used within FriendPresenceProvider",
    );
  }
  return ctx;
}
