"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../../style/modules/Chat.module.css";
import useChatHistory from "@/src/hooks/useChatHistory";
import { useAppSocket } from "@/src/hooks/useAppSocket";
import ChatMessageCard from "@/src/components/cards/ChatMessageCard";
import ChatHeader from "@/src/components/chat/ChatHeader";
import ChatStatus from "@/src/components/chat/ChatStatus";
import ChatInput from "@/src/components/chat/ChatInput";
import useChatRoomSession from "@/src/hooks/useChatRoomSession";

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

  const { joined, roomName, encrypted, error, rateLimited, onlineUsers } =
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
      <div className={styles.card}>
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
          {messages.map((m, i) => (
            <ChatMessageCard
              key={`${m.timestamp}-${m.username}-${i}`}
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
        <p className={styles.sidebarTitle}>Online — {onlineUsers.length}</p>
        <ul className={styles.onlineList}>
          {onlineUsers.map((user) => (
            <li key={user.id} className={styles.onlineUser}>
              <span className={styles.onlineDot} />
              {user.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
