export default async function changeRole(
  userId: string,
  roomId: string,
  action: "PROMOTE" | "DEMOTE",
) {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/rooms/changeRole`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId, roomId, action }),
  });
}
