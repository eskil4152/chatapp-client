"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { WsInbound } from "@/src/shared/types/ws";

type AppSocketContextType = {
  connected: boolean;
  error: string;
  sendJson: (payload: unknown) => void;
  subscribe: (listener: (event: WsInbound) => void) => () => void;
};

const AppSocketContext = createContext<AppSocketContextType | null>(null);

export function AppSocketProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const wsRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef(new Set<(event: WsInbound) => void>());
  const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wsUrl = process.env.NEXT_PUBLIC_WS_API_URL;

  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(
    wsUrl ? "" : "Missing WebSocket configuration",
  );

  const subscribe = useCallback((listener: (event: WsInbound) => void) => {
    listenersRef.current.add(listener);

    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const sendJson = useCallback((payload: unknown) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify(payload));
  }, []);

  useEffect(() => {
    if (!wsUrl) return;
    const ws = new WebSocket(`${wsUrl}/ws`);

    wsRef.current = ws;

    const clearPing = () => {
      if (pingTimerRef.current) {
        clearInterval(pingTimerRef.current);
        pingTimerRef.current = null;
      }
    };

    ws.onopen = () => {
      setConnected(true);
      setError("");

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
        if (data.code === 401) {
          router.replace("/login");
        } else if (data.code === 403) {
          router.replace("/rooms");
        }
      }

      listenersRef.current.forEach((listener) => listener(data));
    };

    ws.onerror = () => {
      setConnected(false);
      setError("WebSocket error");
    };

    ws.onclose = () => {
      setConnected(false);
      clearPing();
      wsRef.current = null;
    };

    return () => {
      clearPing();

      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.close();
        } catch {}
      }

      wsRef.current = null;
    };
  }, [router, wsUrl]);

  return (
    <AppSocketContext.Provider
      value={{
        connected,
        error,
        sendJson,
        subscribe,
      }}
    >
      {children}
    </AppSocketContext.Provider>
  );
}

export function useAppSocket() {
  const ctx = useContext(AppSocketContext);

  if (!ctx) {
    throw new Error("useAppSocket must be used within AppSocketProvider");
  }

  return ctx;
}
