"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GetFriendInfoAPI from "@/src/api/friends/GetFriendInfoAPI";
import Image from "next/image";
import styles from "@/src/style/Friends.module.css";
import img from "../../../../public/default_profile.png";

type Friend = {
  username: string;
  bio?: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string | null;
  birthday?: string;
  createdAt?: string;
  online?: boolean;
};

export default function GetFriendsInfoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const [friend, setFriend] = useState<Friend | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!username) {
        setError("Missing username");
        return;
      }

      const res = await GetFriendInfoAPI(username);

      if (res.status === 200) {
        const data = await res.json();
        setFriend(data);
      } else if (res.status === 401) {
        router.replace("/login");
      } else if (res.status === 404) {
        setError("Friend not found");
      } else {
        setError("Something failed");
      }
    }

    load();
  }, [username, router]);

  if (error) return <p>{error}</p>;
  if (!friend) return <p>Loading...</p>;

  return (
    <div>
      <div className={"avatarBox"}>
        <Image
          src={friend.avatarUrl || img}
          alt={`${friend.username} avatar`}
          width={48}
          height={48}
        />
      </div>
      <h1>{friend.username}</h1>
      {friend.fullName && <p>{friend.fullName}</p>}
      {friend.bio && <p>{friend.bio}</p>}
      {friend.email && <p>{friend.email}</p>}
      {friend.birthday && <p>{friend.birthday}</p>}
      Member since: {friend.createdAt && <p>{friend.createdAt}</p>}
    </div>
  );
}
