"use client";

import Link from "next/link";
import Image from "next/image";
import { useFriendPresence } from "@/src/shared/providers/FriendPresenceProvider";
import img from "@/public/images/default_profile.png";

export default function OnlineFriendsRail() {
  const { onlineFriends } = useFriendPresence();

  if (onlineFriends.length === 0) return null;

  return (
    <>
      {onlineFriends.map((friend) => (
        <Link
          key={friend.userId}
          href={`/friends/info?username=${friend.username}`}
          title={friend.username ?? ""}
        >
          <Image
            src={friend.avatarUrl || img}
            alt={friend.username ?? "friend"}
            width={36}
            height={36}
            style={{ borderRadius: "999px" }}
          />
          <p>{friend.username}</p>
        </Link>
      ))}
    </>
  );
}
