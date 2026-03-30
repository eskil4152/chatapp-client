import fetchJSON from "@/src/shared/lib/fetchJSON";

export default async function getUser() {
  return fetchJSON(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
