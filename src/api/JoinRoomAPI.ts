export default async function JoinRoomAPI(roomId: string) {
  return await fetch(`http://localhost:5050/api/rooms/join`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId: roomId,
    }),
    credentials: "include",
  });
}
