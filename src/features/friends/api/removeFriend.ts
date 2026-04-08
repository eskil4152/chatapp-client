export default async function removeFriend(userId: string) {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/friends/remove`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId }),
  });
}
