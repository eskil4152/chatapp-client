"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "@/src/style/modules/Chat.module.css";
import useChatHistory from "@/src/features/chat/hooks/useChatHistory";
import { useAppSocket } from "@/src/shared/providers/AppSocketProvider";
import ChatMessageCard from "@/src/features/chat/components/ChatMessageCard";
import ChatHeader from "@/src/features/chat/components/ChatHeader";
import ChatStatus from "@/src/features/chat/components/ChatStatus";
import ChatInput from "@/src/features/chat/components/ChatInput";
import useChatRoomSession from "@/src/features/chat/hooks/useChatRoomSession";

export default function ChatClient() {
  const searchParams = useSearchParams();
  const roomIdParam = searchParams.get("id");

  const roomId = useMemo(
    () => (roomIdParam ? roomIdParam.trim() : ""),
    [roomIdParam],
  );

  return <ChatClientInner key={roomId} roomId={roomId} />;
}

function ChatClientInner({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState("");
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const { connected, error: socketError, sendJson, subscribe } = useAppSocket();
  const { messages, setMessages, page, hasMore, loadingOlder, loadMessages } =
    useChatHistory(roomId);

  const { joined, roomName, encrypted, role, error, rateLimited, members } =
    useChatRoomSession({
      roomId,
      connected,
      subscribe,
      sendJson,
      loadMessages,
      setMessages,
    });

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const status: "CONNECTING" | "JOINING" | "READY" | "ERROR" = error
    ? "ERROR"
    : !connected
      ? "CONNECTING"
      : joined
        ? "READY"
        : "JOINING";

  const canSend = status === "READY" && !rateLimited;
  const combinedError = error || socketError;

  function handleSend() {
    if (!canSend) return;

    const trimmed = message.trim();
    if (!trimmed) return;

    sendJson({
      type: "MESSAGE",
      roomId,
      message: trimmed,
    });

    setMessage("");
  }

  if (!process.env.NEXT_PUBLIC_WS_API_URL) {
    return (
      <div className="pageShellNarrow">
        <div className="card centerText">
          <p className="errorBox">Missing WebSocket configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`card ${styles.card}`}>
        <ChatHeader roomName={roomName} encrypted={encrypted} />
        <hr />

        <ChatStatus status={status} error={combinedError} />

        {status === "READY" && hasMore && (
          <div style={{ marginBottom: "0.75rem" }}>
            <button
              type="button"
              className="primaryButton"
              disabled={loadingOlder}
              onClick={() => loadMessages(page + 1, true)}
            >
              {loadingOlder ? "Loading..." : "Load older messages"}
            </button>
          </div>
        )}

        <div className={styles.messages} ref={messagesRef}>
          {messages.map((m) => (
            <ChatMessageCard
              key={`${m.timestamp}-${m.username}`}
              type={m.type}
              username={m.username}
              content={m.content}
              timestamp={m.timestamp}
            />
          ))}
        </div>

        <hr />

        <ChatInput
          message={message}
          setMessage={setMessage}
          canSend={canSend}
          onSend={handleSend}
          textAreaRef={textAreaRef}
        />
      </div>

      <div className={styles.sidebar}>
        <p className={styles.sidebarTitle}>
          Members — {members.filter((u) => u.online).length} / {members.length}{" "}
          online
        </p>
        <ul className={styles.onlineList}>
          {members.map((user) => (
            <li key={user.id} className={styles.onlineUser}>
              <span
                className={`${styles.onlineDot} ${user.online ? "" : styles.offlineDot}`}
              />
              <span className={styles.memberName}>{user.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
