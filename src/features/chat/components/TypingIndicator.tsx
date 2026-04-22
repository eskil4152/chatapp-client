"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/src/style/modules/TypingIndicator.module.css";
import { WsInbound } from "@/src/shared/types/ws";

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

type SubscribeFn = (listener: (event: WsInbound) => void) => () => void;

export function useTypingIndicator(subscribe: SubscribeFn, roomId: string) {
  const [typingUser, setTypingUser] = useState<string | null>(null);
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
        setTypingUser(data.username);
        clearTimer();
        timerRef.current = setTimeout(() => setTypingUser(null), 4000);
        return;
      }

      // Clear when the typing user sends a real message
      if (data.type === "MESSAGE") {
        setTypingUser((prev) => {
          if (prev === data.username) {
            clearTimer();
            return null;
          }
          return prev;
        });
      }
    });
  }, [subscribe, roomId]);

  useEffect(() => () => clearTimer(), []);

  return typingUser;
}
