"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import getFriendInfo from "@/src/features/friends/api/getFriendInfo";
import removeFriend from "@/src/features/friends/api/removeFriend";
import ConfirmPopup from "@/src/shared/components/ConfirmPopup";
import Image from "next/image";
import styles from "@/src/style/modules/Friends.module.css";
import img from "@/public/images/default_profile.png";
import useLoading from "@/src/shared/hooks/useLoading";
import formatTimestamp from "@/src/shared/lib/formatTimestamp";
import { useAppSocket } from "@/src/shared/providers/AppSocketProvider";
import LoadingOverlay from "@/src/features/chat/components/LoadingOverlay";

type Friend = {
  username: string;
  bio?: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string | null;
  birthday?: string;
  createdAt?: string;
  friendsSince?: string;
  online?: boolean;
};

export default function FriendInfoClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const { subscribe } = useAppSocket();
  const [confirmRemove, setConfirmRemove] = useState(false);

  const { loading, error, response } = useLoading(async () => {
    if (!userId) return null;
    const res = await getFriendInfo(userId);

    if (res.status === 200) {
      return res.json();
    } else if (res.status === 401) {
      router.replace("/login");
      return null;
    } else if (res.status === 404) {
      throw new Error("Friend not found");
    } else {
      throw new Error("Unknown error");
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    return subscribe((data) => {
      if (data.type === "FRIEND_REMOVED" && data.userId === userId) {
        router.replace("/friends");
      }
    });
  }, [subscribe, userId, router]);

  if (loading) return <LoadingOverlay />;
  if (error)
    return (
      <p className="errorBox">
        {(error as Error).message ?? "Something failed"}
      </p>
    );
  if (!response) return null;

  const friend = response;

  return (
    <div className="pageShellNarrow">
      {confirmRemove && (
        <ConfirmPopup
          message={`Remove ${friend.username} from friends? This cannot be undone.`}
          confirmLabel="Yes, remove"
          onConfirm={async () => {
            const res = await removeFriend(userId!);
            if (res.ok) {
              router.replace("/friends");
            } else if (res.status === 401) {
              router.replace("/login");
            }
          }}
          onCancel={() => setConfirmRemove(false)}
        />
      )}
      <div className="card">
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatarWrap}>
            <Image
              src={friend.avatarUrl || img}
              alt={`${friend.username} avatar`}
              width={88}
              height={88}
            />
            {friend.online !== undefined && (
              <span
                className={`${styles.statusDot} ${friend.online ? styles.online : styles.offline}`}
              />
            )}
          </div>
          <h1 className={styles.profileName}>{friend.username}</h1>
          {friend.fullName && (
            <p className={styles.profileFullName}>{friend.fullName}</p>
          )}
        </div>

        <div className={styles.profileFields}>
          {friend.bio && (
            <div>
              <span className={styles.fieldLabel}>Bio</span>
              <div className={styles.fieldValue}>{friend.bio}</div>
            </div>
          )}
          {friend.email && (
            <div>
              <span className={styles.fieldLabel}>Email</span>
              <div className={styles.fieldValue}>{friend.email}</div>
            </div>
          )}
          {friend.birthday && (
            <div>
              <span className={styles.fieldLabel}>Birthday</span>
              <div className={styles.fieldValue}>{friend.birthday}</div>
            </div>
          )}
          {friend.friendsSince && (
            <div>
              <span className={styles.fieldLabel}>Friends since</span>
              <div className={styles.fieldValue}>
                {formatTimestamp(friend.friendsSince)}
              </div>
            </div>
          )}
        </div>

        <div className="pageActions">
          <button
            type="button"
            className="dangerButton"
            onClick={() => setConfirmRemove(true)}
          >
            Remove friend
          </button>
        </div>
      </div>
    </div>
  );
}
