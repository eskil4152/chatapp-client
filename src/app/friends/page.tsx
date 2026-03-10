"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../style/Friends.module.css";
import Link from "next/link";
import Image from "next/image";
import GetFriendsAPI from "@/src/api/GetFriendsAPI";
import PrivateMessageAPI from "@/src/api/PrivateMessageAPI";

export default function Friends() {
  const router = useRouter();

  type Friend = {
    username: string;
    avatarUrl: string | null;
  };

  const { loading, error, response } = GetFriendsAPI();
  const [friends, setFriends] = useState<Friend[]>([]);

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
            {friends.map((friend: Friend) => (
              <div key={friend.username} className={styles.friendRow}>
                <button
                  className={styles.friendCard}
                  onClick={() =>
                    router.replace(
                      `/friends/info?username=${encodeURIComponent(friend.username)}`,
                    )
                  }
                >
                  <div className={styles.friendCardLeft}>
                    {friend.avatarUrl ? (
                      <Image
                        src={friend.avatarUrl}
                        alt={`${friend.username} avatar`}
                        width={48}
                        height={48}
                        className="avatarSmall"
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>No avatar</div>
                    )}
                  </div>
                  <div className={styles.friendCardRight}>
                    <div className={styles.friendsUsername}>
                      {friend.username}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  className={styles.chatButton}
                  onClick={async (e) => {
                    e.stopPropagation();

                    const res = await PrivateMessageAPI(friend.username);

                    if (res.ok) {
                      const roomId = await res.text();
                      router.push(`/chat?id=${roomId}`);
                    } else if (res.status === 401) {
                      router.replace("/login");
                    }
                  }}
                >
                  Send message
                </button>
              </div>
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
