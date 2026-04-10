"use client";

import { useInvites } from "@/src/shared/providers/InviteProvider";
import respondToInvite from "@/src/features/invites/api/respondToInvite";
import styles from "@/src/style/modules/InviteToast.module.css";

export default function InviteToast() {
  const { inviteToast, clearInviteToast, setPendingInvites } = useInvites();

  const toast = inviteToast;
  if (!toast) return null;

  const isRoomInvite = toast.inviteType === "ROOM_INVITE";

  async function handleAccept(id: string) {
    const res = await respondToInvite(id, "ACCEPTED");

    if (res.ok) {
      setPendingInvites((prev) => prev.filter((invite) => invite.id !== id));
      clearInviteToast();
    }
  }

  async function handleReject(id: string) {
    const res = await respondToInvite(id, "REJECTED");

    if (res.ok) {
      setPendingInvites((prev) => prev.filter((invite) => invite.id !== id));
      clearInviteToast();
    }
  }

  return (
    <div className={styles.toast}>
      <div className={styles.content}>
        <p>
          <strong>{toast.fromUsername}</strong>{" "}
          {isRoomInvite
            ? `invited you to ${toast.roomName ?? "a room"}`
            : "sent you a friend request"}
        </p>

        <div className={styles.actions}>
          <button
            className="primaryButton"
            onClick={() => handleAccept(toast.id)}
          >
            Accept
          </button>

          <button
            className="secondaryButton"
            onClick={() => handleReject(toast.id)}
          >
            Decline
          </button>
        </div>
      </div>

      <button className={styles.close} onClick={clearInviteToast}>
        ×
      </button>
    </div>
  );
}
