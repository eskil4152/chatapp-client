import fetchJSON from "@/src/shared/lib/fetchJSON";

export default async function getRooms() {
  return fetchJSON(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/rooms`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
