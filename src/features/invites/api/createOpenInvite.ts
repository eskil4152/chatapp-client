export default async function createOpenInvite(
  roomId: string,
  maxUsages: number,
) {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/invites/open`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ type: "OPEN_ROOM_INVITE", roomId, maxUsages }),
  });
}
