export default async function sendRoomInvite(username: string, roomId: string) {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/invites/room`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ type: "ROOM_INVITE", targetUsername: username, roomId }),
  });
}
