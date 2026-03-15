"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import styles from "../../style/Chat.module.css";
import formatTimestamp from "@/src/tools/FormatTimestamp";
import useChatHistory from "@/src/hooks/useChatHistory";
import { useAppSocket } from "@/src/hooks/useAppSocket";
import { WsChat, WsInbound } from "@/src/types/WsChatTypes";

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
  const [roomName, setRoomName] = useState("");
  const [encrypted, setEncrypted] = useState(false);
  const [error, setError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const rateLimitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { connected, error: socketError, sendJson, subscribe } = useAppSocket();

  const { messages, setMessages, page, hasMore, loadingOlder, loadMessages } =
    useChatHistory(roomId);

  const onJoinedAction = useCallback(() => {
    return loadMessages(0, false);
  }, [loadMessages]);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const el = textAreaRef.current;
    if (!el) return;

    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [message]);

  useEffect(() => {
    if (!roomId || !connected) return;

    sendJson({ type: "JOIN", roomId });

    return () => {
      sendJson({ type: "LEAVE", roomId });
    };
  }, [roomId, connected, sendJson]);

  useEffect(() => {
    const unsubscribe = subscribe(async (data: WsInbound) => {
      if (data.type === "ERROR") {
        if (data.code === 429) {
          setError("You are sending messages too fast.");
          setRateLimited(true);

          if (rateLimitTimerRef.current) {
            clearTimeout(rateLimitTimerRef.current);
          }
          if (errorClearTimerRef.current) {
            clearTimeout(errorClearTimerRef.current);
          }

          rateLimitTimerRef.current = setTimeout(() => {
            setRateLimited(false);
            rateLimitTimerRef.current = null;
          }, 3000);

          errorClearTimerRef.current = setTimeout(() => {
            setError("");
            errorClearTimerRef.current = null;
          }, 3000);

          return;
        }

        setError(`${data.code}: ${data.message}`);
        return;
      }

      if (data.type === "JOINED") {
        if (data.roomId !== roomId) return;

        setRoomName(data.roomName);
        setEncrypted(Boolean(data.encrypted));

        try {
          await onJoinedAction();
        } catch {
          setError("Failed to load chat history");
        }
        return;
      }

      if ("username" in data && "content" in data) {
        setMessages((prev) => [...prev, data as WsChat]);
      }
    });

    return unsubscribe;
  }, [roomId, onJoinedAction, setMessages, subscribe]);

  const status: "CONNECTING" | "JOINING" | "READY" | "ERROR" = error
    ? "ERROR"
    : !connected
      ? "CONNECTING"
      : roomName
        ? "READY"
        : "JOINING";

  const canSend = status === "READY" && !rateLimited;

  const handleSend = () => {
    if (!canSend) return;

    const trimmed = message.trim();
    if (!trimmed) return;

    sendJson({
      type: "MESSAGE",
      roomId,
      message: trimmed,
    });

    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const combinedError = error || socketError;

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
        <h2 className={styles.title}>
          {roomName || "Room"}{" "}
          {roomName && (
            <span className={styles.roomMeta}>
              {encrypted ? "Encrypted" : "Not encrypted"}
            </span>
          )}
        </h2>

        <hr />

        {(status !== "READY" || combinedError) && (
          <div className="statusBox">
            {combinedError ? (
              <p>{combinedError}</p>
            ) : (
              <p>{status === "CONNECTING" ? "Connecting..." : "Joining..."}</p>
            )}
          </div>
        )}

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
            <div
              key={`${m.timestamp}-${m.username}-${i}`}
              className={styles.message}
            >
              <div className={styles.messageTopRow}>
                <div className={styles.sender}>{m.username}</div>
                <div className={styles.timestamp}>
                  {formatTimestamp(m.timestamp)}
                </div>
              </div>
              <div className={styles.content}>{m.content}</div>
            </div>
          ))}
        </div>

        <hr />

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <textarea
            ref={textAreaRef}
            placeholder={canSend ? "Enter message" : "Slow down a moment"}
            disabled={!canSend}
            className={styles.input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          <button
            type="submit"
            disabled={!canSend}
            className={`primaryButton ${styles.button}`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
