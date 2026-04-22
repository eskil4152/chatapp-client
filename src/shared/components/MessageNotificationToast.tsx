"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSocket } from "@/src/shared/providers/AppSocketProvider";
import { WsMessageNotification } from "@/src/shared/types/ws";
import styles from "@/src/style/modules/InviteToast.module.css";

export default function MessageNotificationToast() {
  const { subscribe } = useAppSocket();
  const searchParams = useSearchParams();
  const activeRoomId = searchParams.get("id");
  const [notification, setNotification] = useState<WsMessageNotification | null>(null);

  useEffect(() => {
    return subscribe((data) => {
      if (data.type === "MESSAGE_NOTIFICATION" && data.roomId !== activeRoomId) {
        setNotification(data);
      }
    });
  }, [subscribe, activeRoomId]);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  if (!notification) return null;

  const preview =
    notification.message.length > 40
      ? notification.message.slice(0, 40) + "..."
      : notification.message;

  return (
    <div className={styles.toast}>
      <div className={styles.content}>
        <p>
          <strong>{notification.roomName} — {notification.username}</strong>
        </p>
        <p>{preview}</p>
      </div>

      <button className={styles.close} onClick={() => setNotification(null)}>
        ×
      </button>
    </div>
  );
}
