"use client";

import Image from "next/image";
import styles from "@/src/style/modules/Invites.module.css";
import { PendingInvite } from "@/src/features/invites/types";
import defaultAvatar from "@/public/images/default_profile.png";

function inviteLabel(invite: PendingInvite): string {
  if (invite.type === "FRIEND_REQUEST") return "Friend request";
  if (invite.roomName) return `Room invite — ${invite.roomName}`;
  return "Room invite";
}

type Props = {
  invite: PendingInvite;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
};

export default function IncomingInviteCard({ invite, onAccept, onReject }: Props) {
  return (
    <div className={styles.inviteCard}>
      <div className={styles.inviteHeader}>
        {invite.fromAvatarUrl ? (
          <Image
            className={styles.avatar}
            src={invite.fromAvatarUrl}
            alt={invite.fromUsername}
            width={36}
            height={36}
          />
        ) : (
          <Image
            className={styles.avatar}
            src={defaultAvatar}
            alt={invite.fromUsername}
            width={36}
            height={36}
          />
        )}
        <div className={styles.inviteInfo}>
          <div className={styles.inviteUsername}>{invite.fromUsername}</div>
          <div className={styles.inviteType}>{inviteLabel(invite)}</div>
        </div>
      </div>

      <div className={styles.inviteActions}>
        <button className={styles.acceptButton} onClick={() => onAccept(invite.id)}>
          Accept
        </button>
        {invite.type !== "OPEN_ROOM_INVITE" && (
          <button className={styles.rejectButton} onClick={() => onReject(invite.id)}>
            Decline
          </button>
        )}
      </div>
    </div>
  );
}
