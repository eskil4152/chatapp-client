"use client";

import styles from "@/src/style/modules/Friends.module.css";
import { useRouter } from "next/navigation";
import img from "@/public/images/default_profile.png";
import Image from "next/image";
import privateMessage from "@/src/features/rooms/api/privateMessage";
import { FriendType } from "@/src/features/friends/types";

export default function FriendCard(friend: FriendType) {
  const router = useRouter();

  return (
    <div className="itemRow">
      <button
        className="interactiveCard"
        onClick={() =>
          void router.replace(
            `/friends/info?username=${encodeURIComponent(friend.username)}`,
          )
        }
      >
        <div className={styles.friendCardLeft}>
          <div className={styles.avatarBox}>
            <Image
              src={friend.avatarUrl || img}
              alt={`${friend.username} avatar`}
              width={48}
              height={48}
            />
            <span
              className={`${styles.statusDot} ${
                friend.online ? styles.online : styles.offline
              }`}
            />
          </div>
        </div>
        <div className={styles.friendCardRight}>
          <div className={styles.friendsUsername}>{friend.username}</div>
        </div>
      </button>

      <button
        type="button"
        className="actionButton"
        onClick={async (e) => {
          e.stopPropagation();

          const res = await privateMessage(friend.username);

          if (res.ok) {
            const roomId = (await res.text()).trim();
            void router.replace(`/chat?id=${encodeURIComponent(roomId)}`);
          } else if (res.status === 401) {
            void router.replace("/login");
          }
        }}
      >
        Send message
      </button>
    </div>
  );
}
