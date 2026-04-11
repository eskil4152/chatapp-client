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
  allFriendsPresence: OnlineFriend[];
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

      if (data.type === "FRIEND_ADDED") {
        setFriendsMap((prev) => {
          const next = new Map(prev);
          next.set(data.userId, {
            userId: data.userId,
            username: data.username,
            avatarUrl: data.avatarUrl,
            online: data.online,
          });
          return next;
        });
        return;
      }

      if (data.type === "FRIEND_REMOVED") {
        setFriendsMap((prev) => {
          const next = new Map(prev);
          next.delete(data.userId);
          return next;
        });
        return;
      }

      if (data.type === "FRIEND_PRESENCE") {
        setFriendsMap((prev) => {
          const existing = prev.get(data.userId);
          if (!existing) {
            return prev;
          }

          const next = new Map(prev);
          next.set(data.userId, {
            ...existing,
            online: data.online,
          });
          return next;
        });
      }
    });
  }, [subscribe]);

  const allFriendsPresence = useMemo(
    () => Array.from(friendsMap.values()),
    [friendsMap],
  );

  const onlineFriends = useMemo(
    () => allFriendsPresence.filter((friend) => friend.online),
    [allFriendsPresence],
  );

  const value = useMemo(
    () => ({
      onlineFriends,
      allFriendsPresence,
      isOnline: (userId: string) => friendsMap.get(userId)?.online === true,
    }),
    [onlineFriends, allFriendsPresence, friendsMap],
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
