"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import getFriendInfo from "@/src/features/friends/api/getFriendInfo";
import removeFriend from "@/src/features/friends/api/removeFriend";
import ConfirmPopup from "@/src/shared/components/ConfirmPopup";
import Image from "next/image";
import styles from "@/src/style/modules/Friends.module.css";
import img from "@/public/images/default_profile.png";
import useLoading from "@/src/shared/hooks/useLoading";

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

export default function FriendInfoClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [confirmRemove, setConfirmRemove] = useState(false);

  const { loading, error, response } = useLoading(async () => {
    if (!userId) return null;
    const res = await getFriendInfo(userId);
    if (res.status === 401) { router.replace("/login"); return null; }
    if (!res.ok) throw new Error(res.status === 404 ? "Friend not found" : "Something failed");
    return res.json() as Promise<Friend>;
  }, [[userId]]);

  if (loading) return <p className="loadingText">Loading...</p>;
  if (error) return <p className="errorBox">{(error as Error).message ?? "Something failed"}</p>;
  if (!response) return null;

  const friend = response;

  return (
    <div>
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

      <div className={styles.avatarBox}>
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

      <button
        type="button"
        className="dangerButton"
        onClick={() => setConfirmRemove(true)}
      >
        Remove friend
      </button>
    </div>
  );
}
