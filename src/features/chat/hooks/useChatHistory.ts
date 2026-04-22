"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getChats from "@/src/features/chat/api/getChats";
import { WsChat } from "@/src/shared/types/ws";

const PAGE_SIZE = 25;

export default function useChatHistory(roomId: string) {
  const router = useRouter();

  const [messages, setMessages] = useState<WsChat[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);

  useEffect(() => {
    setMessages([]);
    setPage(0);
    setHasMore(true);
    setLoadingOlder(false);
  }, [roomId]);

  const loadMessages = useCallback(
    async (targetPage: number, prepend: boolean) => {
      if (!roomId) return;

      setLoadingOlder(true);

      try {
        const history = await getChats(roomId, targetPage, PAGE_SIZE);

        const mapped: WsChat[] = history.map((m) => ({
          type: "MESSAGE",
          userId: m.userId,
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

        throw e;
      } finally {
        setLoadingOlder(false);
      }
    },
    [roomId, router],
  );

  return {
    messages,
    setMessages,
    page,
    hasMore,
    loadingOlder,
    loadMessages,
  };
}
