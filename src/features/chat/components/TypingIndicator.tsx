"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/src/style/modules/TypingIndicator.module.css";
import { WsInbound } from "@/src/shared/types/ws";

type TypingState = {
  userId: string;
  username: string;
} | null;

type SubscribeFn = (listener: (event: WsInbound) => void) => () => void;

export function TypingIndicator({ userName }: { userName: string }) {
  return (
    <div className={styles.row}>
      <div className={styles.avatar}>{userName[0].toUpperCase()}</div>
      <div className={styles.bubble}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={styles.dot}
            style={{ animationDelay: `${i * 0.14}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function useTypingIndicator(
  subscribe: SubscribeFn,
  roomId: string,
  currentUserId?: string,
) {
  const [typing, setTyping] = useState<TypingState>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return subscribe((data) => {
      if (data.type === "TYPING" && data.roomId === roomId) {
        if (currentUserId && data.userId === currentUserId) return;

        setTyping({
          userId: data.userId,
          username: data.username,
        });

        clearTimer();
        timerRef.current = setTimeout(() => setTyping(null), 4000);
        return;
      }

      if (data.type === "MESSAGE") {
        setTyping((prev) => {
          if (prev?.userId === data.userId) {
            clearTimer();
            return null;
          }
          return prev;
        });
      }
    });
  }, [subscribe, roomId, currentUserId]);

  useEffect(() => () => clearTimer(), []);

  return typing;
}
