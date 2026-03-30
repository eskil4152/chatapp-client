export default async function editRoom(roomId: string, roomName: string) {
  return await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/rooms/edit`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: roomId,
        roomName: roomName,
      }),
      credentials: "include",
    },
  );
}
