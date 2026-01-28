export default async function MakeRoomAPI(roomName: string) {
  return await fetch(`http://localhost:5050/api/rooms/make`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomName: roomName,
    }),
    credentials: "include",
  });
}
