export default async function MakeRoomAPI(
  roomName: string,
  encryption: boolean,
) {
  return await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/rooms/make`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomName: roomName,
        encrypted: encryption,
      }),
      credentials: "include",
    },
  );
}
