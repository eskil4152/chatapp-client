import useLoading from "@/src/tools/UseLoading";
import fetchJSON from "@/src/tools/FetchJSON";

export default function GetRoomsAPI() {
  const { loading, error, response } = useLoading(
    async () =>
      await fetchJSON(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/rooms`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
  );

  return { loading, error, response };
}
