export default async function JoinRoomAPI(roomId: string) {
  return await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/rooms/join`,
    {
      method: "post",
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
