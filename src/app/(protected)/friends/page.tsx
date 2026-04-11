"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import useFriends from "@/src/features/friends/hooks/useFriends";
import FriendCard from "@/src/features/friends/components/FriendCard";
import { useFriendPresence } from "@/src/shared/providers/FriendPresenceProvider";
import { FriendType } from "@/src/features/friends/types";
import { useAppSocket } from "@/src/shared/providers/AppSocketProvider";

export default function Friends() {
  const router = useRouter();
  const { isOnline } = useFriendPresence();
  const { subscribe } = useAppSocket();

  const { loading, error, response, reload } = useFriends();

  const friends =
    response?.status === 200 ? (response.data as FriendType[]) : [];

  useEffect(() => {
    if (response?.status === 401) {
      router.replace("/login");
    }
  }, [response, router]);

  useEffect(() => {
    return subscribe((data) => {
      if (
        data.type === "INVITE_ACCEPTED" ||
        data.type === "FRIEND_ADDED" ||
        data.type === "FRIEND_REMOVED"
      ) {
        void reload();
      }
    });
  }, [subscribe, reload]);

  return (
    <div className="pageList">
      <h2 className="sectionTitle">Friends</h2>

      {loading && <p className="empty">Loading...</p>}
      {!loading && !!error && (
        <p className="errorBox">Failed to load friends</p>
      )}
      {!loading && !error && friends.length === 0 && (
        <p className="empty">No friends :(</p>
      )}

      {friends.length > 0 && (
        <div className="itemList">
          {friends.map((friend) => (
            <FriendCard
              key={friend.username}
              {...friend}
              online={isOnline(friend.userId)}
            />
          ))}
        </div>
      )}

      <hr className="divider" />

      <div className="pageActions">
        <Link href="/friends/add" className="primaryButton">
          Add friends
        </Link>
      </div>
    </div>
  );
}
