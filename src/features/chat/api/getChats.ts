import { HistoryMessage } from "@/src/shared/types/ws";

export default async function getChats(
  roomId: string,
  page = 0,
  size = 25,
): Promise<HistoryMessage[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/chats/${roomId}?page=${page}&size=${size}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (res.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (res.status === 404) {
    throw new Error("NOT_FOUND");
  }

  if (!res.ok) {
    throw new Error("FETCH_FAILED");
  }

  return (await res.json()) as HistoryMessage[];
}
