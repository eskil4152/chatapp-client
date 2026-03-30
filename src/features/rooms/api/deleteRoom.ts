export default async function deleteRoom(roomId: string | null) {
  return await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/rooms/delete`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: roomId,
      }),
      credentials: "include",
    },
  );
}
