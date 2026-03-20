import useLoading from "@/src/hooks/UseLoading";
import fetchJSON from "@/src/lib/FetchJSON";

export default function GetFriendsAPI() {
  const { loading, error, response } = useLoading(
    async () =>
      await fetchJSON(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/friends`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
  );

  return { loading, error, response };
}
