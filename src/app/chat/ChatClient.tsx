"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../style/Chat.module.css";
import formatTimestamp from "@/src/tools/FormatTimestamp";
import { WsChat, WsInbound } from "@/src/types/WsChatTypes";
import GetChatAPI from "@/src/api/GetChatsAPI";

const PAGE_SIZE = 25;

export default function ChatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomIdParam = searchParams.get("id");

  const roomId = useMemo(
    () => (roomIdParam ? roomIdParam.trim() : ""),
    [roomIdParam],
  );

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<WsChat[]>([]);
  const [roomName, setRoomName] = useState<string>("");
  const [encrypted, setEncrypted] = useState<boolean>(false);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<
    "CONNECTING" | "JOINING" | "READY" | "ERROR"
  >("CONNECTING");
  const [error, setError] = useState<string>("");
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statusRef = useRef(status);
  const rateLimitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

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
    if (!roomId) return;

    const t = setTimeout(() => {
      setStatus("CONNECTING");
      setError("");
      setRoomName("");
      setEncrypted(false);
      setMessages([]);
      setConnected(false);
      setMessage("");
      setRateLimitedUntil(null);
      setPage(0);
      setHasMore(true);
      setLoadingOlder(false);
    }, 0);

    return () => clearTimeout(t);
  }, [roomId]);

  async function loadMessages(targetPage: number, prepend: boolean) {
    if (!roomId) return;

    setLoadingOlder(true);

    try {
      const history = await GetChatAPI(roomId, targetPage, PAGE_SIZE);

      const mapped: WsChat[] = history.map((m) => ({
        type: "MESSAGE",
        username: m.username,
        content: m.message ?? "",
        timestamp: m.timestamp,
      }));

      setMessages((prev) => {
        if (!prepend) {
          return mapped;
        }

        const merged = [...mapped, ...prev];

        return merged.filter(
          (msg, index, arr) =>
            index ===
            arr.findIndex(
              (x) =>
                x.type === msg.type &&
                x.username === msg.username &&
                x.content === msg.content &&
                x.timestamp === msg.timestamp,
            ),
        );
      });

      setPage(targetPage);
      setHasMore(history.length === PAGE_SIZE);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "UNAUTHORIZED") {
          router.replace("/login");
          return;
        }

        if (e.message === "FORBIDDEN" || e.message === "NOT_FOUND") {
          router.replace("/rooms");
          return;
        }
      }

      setStatus("ERROR");
      setError("Failed to load chat history");
    } finally {
      setLoadingOlder(false);
    }
  }

  useEffect(() => {
    if (!roomId) {
      router.replace("/rooms");
      return;
    }

    if (!process.env.NEXT_PUBLIC_WS_API_URL) return;

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_API_URL}/ws`);
    wsRef.current = ws;

    const sendLeave = () => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({ type: "LEAVE", roomId }));
        } catch {}
      }
    };

    const handleBeforeUnload = () => {
      sendLeave();
    };

    const cleanup = () => {
      if (pingTimerRef.current) {
        clearInterval(pingTimerRef.current);
        pingTimerRef.current = null;
      }
      if (rateLimitTimerRef.current) {
        clearTimeout(rateLimitTimerRef.current);
        rateLimitTimerRef.current = null;
      }
      if (errorClearTimerRef.current) {
        clearTimeout(errorClearTimerRef.current);
        errorClearTimerRef.current = null;
      }
      wsRef.current = null;
    };

    ws.onopen = () => {
      setConnected(true);
      setStatus("JOINING");

      ws.send(JSON.stringify({ type: "JOIN", roomId }));

      pingTimerRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "PING" }));
        }
      }, 25000);
    };

    ws.onmessage = async (event) => {
      let data: WsInbound | null = null;

      try {
        data = JSON.parse(event.data) as WsInbound;
      } catch {
        return;
      }

      if (!data || typeof data !== "object" || !("type" in data)) return;

      if (data.type === "ERROR") {
        if (data.code === 429) {
          const until = Date.now() + 3000;
          setError("You are sending messages too fast.");
          setRateLimitedUntil(until);

          if (rateLimitTimerRef.current) {
            clearTimeout(rateLimitTimerRef.current);
          }
          if (errorClearTimerRef.current) {
            clearTimeout(errorClearTimerRef.current);
          }

          rateLimitTimerRef.current = setTimeout(() => {
            setRateLimitedUntil(null);
            rateLimitTimerRef.current = null;
          }, 3000);

          errorClearTimerRef.current = setTimeout(() => {
            setError("");
            errorClearTimerRef.current = null;
          }, 3000);

          return;
        }

        setStatus("ERROR");
        setError(`${data.code}: ${data.message}`);

        if (data.code === 401) router.replace("/login");
        if (data.code === 403) router.replace("/rooms");
        return;
      }

      if (data.type === "JOINED") {
        setRoomName(data.roomName);
        setEncrypted(Boolean(data.encrypted));
        await loadMessages(0, false);
        setStatus("READY");
        return;
      }

      if ("username" in data && "content" in data) {
        setMessages((prev) => [...prev, data]);
      }
    };

    ws.onerror = () => {
      setConnected(false);
      setStatus("ERROR");
      setError("WebSocket error");
    };

    ws.onclose = () => {
      setConnected(false);
      cleanup();

      if (statusRef.current !== "ERROR") {
        setStatus("ERROR");
        setError("Disconnected");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({ type: "LEAVE", roomId }));
        } catch {}

        try {
          ws.close();
        } catch {}
      }

      cleanup();
    };
  }, [roomId, router]);

  const rateLimited =
    rateLimitedUntil !== null && Date.now() < rateLimitedUntil;

  const canSend = status === "READY" && connected && !rateLimited;

  function sendCurrentMessage() {
    if (!canSend) return;

    const trimmed = message.trim();
    if (!trimmed) return;

    wsRef.current?.send(
      JSON.stringify({
        type: "MESSAGE",
        roomId,
        message: trimmed,
      }),
    );

    setMessage("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendCurrentMessage();
    }
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
        <h2 className={styles.title}>
          {roomName ? roomName : "Room"} {""}
          {roomName && (
            <span className={styles.roomMeta}>
              {encrypted ? "Encrypted" : "Not encrypted"}
            </span>
          )}
        </h2>

        <hr />

        {(status !== "READY" || error) && (
          <div className="statusBox">
            {error ? (
              <p>{error}</p>
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
            sendCurrentMessage();
          }}
        >
          <textarea
            ref={textAreaRef}
            id="message"
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
