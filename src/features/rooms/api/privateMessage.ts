export default async function privateMessage(username: string) {
  return await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/rooms/dm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
    credentials: "include",
  });
}
