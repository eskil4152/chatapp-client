import fetchJSON from "@/src/shared/lib/fetchJSON";

export default async function getRoomMembers(roomId: string) {
  return fetchJSON(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/rooms/${roomId}/members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
