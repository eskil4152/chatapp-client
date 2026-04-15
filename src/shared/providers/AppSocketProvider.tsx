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
import { clearSession } from "@/src/shared/lib/clearSession";

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
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
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

    let active = true;

    function connect() {
      const ws = new WebSocket(`${wsUrl}/ws`);
      wsRef.current = ws;

      const clearPing = () => {
        if (pingTimerRef.current) {
          clearInterval(pingTimerRef.current);
          pingTimerRef.current = null;
        }
      };

      ws.onopen = () => {
        reconnectAttemptRef.current = 0;
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
          if (data.code === 401) { clearSession(); router.replace("/login"); }
          else if (data.code === 403) router.replace("/rooms");
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
        if (!active) return;

        const delay = Math.min(2000 * 2 ** reconnectAttemptRef.current, 30000);
        reconnectAttemptRef.current += 1;
        setError(`Reconnecting... Attempt ${reconnectAttemptRef.current}`);
        reconnectTimerRef.current = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      active = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (pingTimerRef.current) clearInterval(pingTimerRef.current);
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.close();
        } catch {}
      }
      wsRef.current = null;
    };
  }, [router, wsUrl]);

  return (
    <AppSocketContext.Provider
      value={{ connected, error, sendJson, subscribe }}
    >
      {children}
    </AppSocketContext.Provider>
  );
}

export function useAppSocket() {
  const ctx = useContext(AppSocketContext);
  if (!ctx)
    throw new Error("useAppSocket must be used within AppSocketProvider");
  return ctx;
}
