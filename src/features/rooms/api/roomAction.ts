export default async function roomAction(
  roomId: string,
  userId: string,
  action: "KICK" | "BAN",
  reason = "",
) {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/rooms/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomId, userId, action, reason }),
    credentials: "include",
  });
}
