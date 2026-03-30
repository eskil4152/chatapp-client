import fetchJSON from "@/src/shared/lib/fetchJSON";

export default async function getBanList(roomId: string) {
  return fetchJSON(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/rooms/bans/${encodeURIComponent(roomId)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
}
