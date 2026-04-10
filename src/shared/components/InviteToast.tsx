"use client";

import { useInvites } from "@/src/shared/providers/InviteProvider";
import respondToInvite from "@/src/features/invites/api/respondToInvite";
import styles from "@/src/style/modules/InviteToast.module.css";

export default function InviteToast() {
  const {
    inviteToast,
    acceptedToast,
    clearInviteToast,
    clearAcceptedToast,
    setPendingInvites,
  } = useInvites();

  const incoming = inviteToast;
  const accepted = acceptedToast;

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

  if (incoming) {
    const isRoomInvite = incoming.inviteType === "ROOM_INVITE";

    return (
      <div className={styles.toast}>
        <div className={styles.content}>
          <p>
            <strong>{incoming.fromUsername}</strong>{" "}
            {isRoomInvite
              ? `invited you to ${incoming.roomName ?? "a room"}`
              : "sent you a friend request"}
          </p>

          <div className={styles.actions}>
            <button
              className="primaryButton"
              onClick={() => handleAccept(incoming.id)}
            >
              Accept
            </button>

            <button
              className="secondaryButton"
              onClick={() => handleReject(incoming.id)}
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

  if (accepted) {
    const isRoomInvite = accepted.inviteType === "ROOM_INVITE";

    return (
      <div className={styles.toast}>
        <div className={styles.content}>
          <p>
            <strong>{accepted.username}</strong>{" "}
            {isRoomInvite
              ? "accepted your room invite"
              : "accepted your friend request"}
          </p>
        </div>

        <button className={styles.close} onClick={clearAcceptedToast}>
          ×
        </button>
      </div>
    );
  }

  return null;
}
