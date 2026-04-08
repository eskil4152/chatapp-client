"use client";

import Image from "next/image";
import styles from "@/src/style/modules/Invites.module.css";
import { OutgoingInvite } from "@/src/features/invites/types";
import defaultAvatar from "@/public/images/default_profile.png";

export default function OutgoingInviteCard({ invite }: { invite: OutgoingInvite }) {
  if (invite.type === "OPEN_ROOM_INVITE") {
    return (
      <div className={styles.inviteCard}>
        <div className={styles.inviteHeader}>
          <div className={styles.avatarFallback}>🔗</div>
          <div className={styles.inviteInfo}>
            <div className={styles.inviteUsername}>Open room invite</div>
            <div className={styles.inviteType}>Room ID: {invite.roomId}</div>
          </div>
        </div>
        <div className={styles.usageBar}>
          {invite.usages} / {invite.maxUsages} uses
        </div>
        <div className={styles.inviteLink}>{invite.id}</div>
      </div>
    );
  }

  return (
    <div className={styles.inviteCard}>
      <div className={styles.inviteHeader}>
        {invite.avatar ? (
          <Image
            className={styles.avatar}
            src={invite.avatar}
            alt={invite.toUsername}
            width={36}
            height={36}
          />
        ) : (
          <Image
            className={styles.avatar}
            src={defaultAvatar}
            alt={invite.toUsername}
            width={36}
            height={36}
          />
        )}
        <div className={styles.inviteInfo}>
          <div className={styles.inviteUsername}>{invite.toUsername}</div>
          <div className={styles.inviteType}>
            {invite.type === "FRIEND_REQUEST" ? "Friend request sent" : "Room invite sent"}
          </div>
        </div>
      </div>
    </div>
  );
}
