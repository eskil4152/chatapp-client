"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WsChat, WsInbound } from "@/src/types/WsChatTypes";

type UseChatSocketProps = {
  roomId: string;
  onIncomingMessageAction: (updater: (prev: WsChat[]) => WsChat[]) => void;
  onJoinedAction: () => Promise<void>;
};

export default function useChatSocket({
  roomId,
  onIncomingMessageAction,
  onJoinedAction,
}: UseChatSocketProps) {
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [encrypted, setEncrypted] = useState(false);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<
    "CONNECTING" | "JOINING" | "READY" | "ERROR"
  >("CONNECTING");
  const [error, setError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statusRef = useRef(status);
  const rateLimitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (!roomId) {
      router.replace("/rooms");
      return;
    }

    if (!process.env.NEXT_PUBLIC_WS_API_URL) {
      setStatus("ERROR");
      setError("Missing WebSocket configuration");
      return;
    }

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_API_URL}/ws`);
    wsRef.current = ws;

    const clearTimers = () => {
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
    };

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

    ws.onopen = () => {
      setConnected(true);
      setStatus("JOINING");
      setError("");
      setRateLimited(false);

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

        setStatus("ERROR");
        setError(`${data.code}: ${data.message}`);

        if (data.code === 401) router.replace("/login");
        if (data.code === 403) router.replace("/rooms");
        return;
      }

      if (data.type === "JOINED") {
        setRoomName(data.roomName);
        setEncrypted(Boolean(data.encrypted));

        try {
          await onJoinedAction();
          setStatus("READY");
        } catch {
          setStatus("ERROR");
          setError("Failed to load chat history");
        }
        return;
      }

      if ("username" in data && "content" in data) {
        onIncomingMessageAction((prev) => [...prev, data]);
      }
    };

    ws.onerror = () => {
      setConnected(false);
      setStatus("ERROR");
      setError("WebSocket error");
    };

    ws.onclose = () => {
      setConnected(false);
      clearTimers();
      wsRef.current = null;

      if (statusRef.current !== "ERROR") {
        setStatus("ERROR");
        setError("Disconnected");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearTimers();

      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({ type: "LEAVE", roomId }));
        } catch {}

        try {
          ws.close();
        } catch {}
      }

      wsRef.current = null;
    };
  }, [roomId, router, onIncomingMessageAction, onJoinedAction]);

  const canSend = status === "READY" && connected && !rateLimited;

  const sendCurrentMessage = (message: string) => {
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
  };

  return {
    roomName,
    encrypted,
    status,
    error,
    canSend,
    sendCurrentMessage,
  };
}
