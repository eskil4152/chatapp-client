export default async function unbanUser(roomId: string, userId: string) {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/rooms/unban`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      roomId: roomId,
      userId: userId,
    }),
    credentials: "include",
  });
}
