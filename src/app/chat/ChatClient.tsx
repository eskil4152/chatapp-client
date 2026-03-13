"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../style/Chat.module.css";
import formatTimestamp from "@/src/tools/FormatTimestamp";

type WsJoined = {
  type: "JOINED";
  roomId: string;
  roomName: string;
  encrypted: boolean;
};

type WsError = {
  type: "ERROR";
  code: number;
  message: string;
};

type WsChat = {
  type: "MESSAGE" | "JOIN" | "LEAVE";
  username: string;
  content: string;
  timestamp: string;
};

type WsInbound = WsJoined | WsError | WsChat;

export default function ChatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomIdParam = searchParams.get("id");

  const roomId = useMemo(
    () => (roomIdParam ? roomIdParam.trim() : ""),
    [roomIdParam],
  );

  const base = process.env.NEXT_PUBLIC_WS_API_URL ?? "";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<WsChat[]>([]);
  const [roomName, setRoomName] = useState<string>("");
  const [encrypted, setEncrypted] = useState<boolean>(false);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<
    "CONNECTING" | "JOINING" | "READY" | "ERROR"
  >("CONNECTING");
  const [error, setError] = useState<string>("");

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statusRef = useRef(status);

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
    }, 0);

    return () => clearTimeout(t);
  }, [roomId]);

  useEffect(() => {
    if (!roomId) {
      router.replace("/rooms");
      return;
    }

    if (!base) return;

    const ws = new WebSocket(`${base}/ws`);
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

    ws.onmessage = (event) => {
      let data: WsInbound | null = null;

      try {
        data = JSON.parse(event.data) as WsInbound;
      } catch {
        return;
      }

      if (!data || typeof data !== "object" || !("type" in data)) return;

      if (data.type === "ERROR") {
        setStatus("ERROR");
        setError(`${data.code}: ${data.message}`);

        if (data.code === 401) router.replace("/login");
        if (data.code === 403) router.replace("/rooms");
        return;
      }

      if (data.type === "JOINED") {
        setRoomName(data.roomName);
        setEncrypted(Boolean(data.encrypted));
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
  }, [roomId, router, base]);

  const canSend = status === "READY" && connected;

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

  if (!base) {
    return (
      <div className="pageShellNarrow">
        <div className="card centerText">
          <p className="errorBox">Missing NEXT_PUBLIC_WS_API_URL</p>
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

        {status !== "READY" && (
          <div className="statusBox">
            {status === "ERROR" ? (
              <p>{error || "Something failed"}</p>
            ) : (
              <p>{status === "CONNECTING" ? "Connecting..." : "Joining..."}</p>
            )}
          </div>
        )}

        <div className={styles.messages} ref={messagesRef}>
          {messages.map((m, i) => (
            <div key={i} className={styles.message}>
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
            placeholder={canSend ? "Enter message" : "Not connected"}
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
