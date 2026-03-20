"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../style/modules/Friends.module.css";
import Link from "next/link";
import GetFriendsAPI from "@/src/api/friends/GetFriendsAPI";
import FriendCard from "@/src/components/cards/FriendCard";

export default function Friends() {
  const router = useRouter();

  const { loading, error, response } = GetFriendsAPI();
  const [friends, setFriends] = useState<FriendType[]>([]);

  useEffect(() => {
    if (response?.status === 401) {
      router.replace("/login");
    }
  }, [response, router]);

  useEffect(() => {
    if (response?.status === 200) {
      setFriends(response.data ?? []);
    }
  }, [response]);

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Friends</h2>

      {friends.length === 0 && <p className={styles.empty}>No friends :(</p>}

      {friends.length > 0 && (
        <>
          <div className={styles.friendsList}>
            {friends.map((friend: FriendType) => (
              <FriendCard key={friend.username} {...friend} />
            ))}
          </div>
        </>
      )}

      <hr className="divider" />

      <div className={styles.actions}>
        <Link href="/friends/add" className="primaryButton">
          Add friends
        </Link>
      </div>
    </div>
  );
}
