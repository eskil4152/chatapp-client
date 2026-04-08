export default async function respondToInvite(
  inviteId: string,
  response: "ACCEPTED" | "REJECTED",
) {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/invites/respond`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ inviteId, response }),
  });
}
