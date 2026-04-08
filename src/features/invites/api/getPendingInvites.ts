import fetchJSON from "@/src/shared/lib/fetchJSON";

export default async function getPendingInvites() {
  return fetchJSON(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/invites/pending`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
