"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import useFriends from "@/src/features/friends/hooks/useFriends";
import FriendCard from "@/src/features/friends/components/FriendCard";
import { useAppSocket } from "@/src/shared/providers/AppSocketProvider";
import { FriendType } from "@/src/features/friends/types";

export default function Friends() {
  const router = useRouter();
  const { subscribe } = useAppSocket();

  const { loading, error, response } = useFriends();
  const [friends, setFriends] = useState<FriendType[]>([]);

  useEffect(() => {
    if (response?.status === 401) {
      router.replace("/login");
    }
  }, [response, router]);

  useEffect(() => {
    if (response?.status === 200) {
      setFriends((response.data as FriendType[]) ?? []);
    }
  }, [response]);

  useEffect(() => {
    const unsubscribe = subscribe((data) => {
      if (data.type !== "FRIEND_PRESENCE") return;
      setFriends((prev) =>
        prev.map((f) => f.userId === data.userId ? { ...f, online: data.online } : f)
      );
    });
    return unsubscribe;
  }, [subscribe]);

  return (
    <div className="pageList">
      <h2 className="sectionTitle">Friends</h2>

      {loading && <p className="empty">Loading...</p>}
      {!loading && !!error && <p className="errorBox">Failed to load friends</p>}
      {!loading && !error && friends.length === 0 && <p className="empty">No friends :(</p>}

      {friends.length > 0 && (
        <div className="itemList">
          {friends.map((friend) => (
            <FriendCard key={friend.username} {...friend} />
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
