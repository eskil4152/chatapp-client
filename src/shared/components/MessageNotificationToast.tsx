"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useAppSocket } from "@/src/shared/providers/AppSocketProvider";
import { WsMessageNotification } from "@/src/shared/types/ws";
import styles from "@/src/style/modules/InviteToast.module.css";

export default function MessageNotificationToast() {
  const { subscribe } = useAppSocket();
  const searchParams = useSearchParams();
  const router = useRouter();
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

  function handleClick() {
    router.push(`/chat?id=${notification!.roomId}`);
    setNotification(null);
  }

  return (
    <div className={styles.toast}>
      <div className={styles.content} onClick={handleClick} style={{ cursor: "pointer" }}>
        <p style={{ margin: 0 }}>
          <strong>{notification.username}</strong> in {notification.roomName}
        </p>
        <p style={{ margin: 0, color: "var(--text-soft)" }}>{preview}</p>
      </div>

      <button className={styles.close} onClick={() => setNotification(null)}>
        ×
      </button>
    </div>
  );
}
