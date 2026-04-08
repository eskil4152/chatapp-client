export default async function sendFriendRequest(username: string) {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/invites/friend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username }),
  });
}
