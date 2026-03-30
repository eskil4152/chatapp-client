import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RoomUser, WsChat, WsInbound } from "@/src/shared/types/ws";

type UseChatRoomSessionProps = {
  roomId: string;
  connected: boolean;
  sendJson: (payload: unknown) => void;
  subscribe: (handler: (data: WsInbound) => void | Promise<void>) => () => void;
  loadMessages: (page: number, append: boolean) => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<WsChat[]>>;
};

export default function useChatRoomSession({
  roomId,
  connected,
  sendJson,
  subscribe,
  loadMessages,
  setMessages,
}: UseChatRoomSessionProps) {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [encrypted, setEncrypted] = useState(false);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const [joined, setJoined] = useState(false);
  const [members, setMembers] = useState<RoomUser[]>([]);

  const rateLimitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onJoinedAction = useCallback(() => {
    return loadMessages(0, false);
  }, [loadMessages]);

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

      if (data.type === "ROOM_JOINED") {
        if (data.roomId !== roomId) return;

        setJoined(true);
        setRoomName(data.roomName);
        setEncrypted(Boolean(data.encrypted));
        setRole(data.role ?? "");
        setMembers(data.members ?? []);

        try {
          await onJoinedAction();
        } catch {
          setError("Failed to load chat history");
        }
        return;
      }

      if (data.type === "ROOM_ACTION") {
        if (data.roomId !== roomId) return;
        router.replace("/rooms");
        return;
      }

      if (data.type === "ROOM_PRESENCE") {
        if (data.roomId !== roomId) return;
        setMembers((prev) =>
          prev.map((u) =>
            u.id === data.userId ? { ...u, online: data.online } : u,
          ),
        );
        return;
      }

      if ("username" in data && "content" in data) {
        setMessages((prev) => [...prev, data as WsChat]);
      }
    });

    return unsubscribe;
  }, [roomId, onJoinedAction, setMessages, subscribe]);

  useEffect(() => {
    return () => {
      if (rateLimitTimerRef.current) clearTimeout(rateLimitTimerRef.current);
      if (errorClearTimerRef.current) clearTimeout(errorClearTimerRef.current);
    };
  }, []);

  return {
    joined,
    roomName,
    encrypted,
    role,
    error,
    rateLimited,
    members,
  };
}
