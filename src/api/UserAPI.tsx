"use client";

import fetchJSON from "@/src/tools/FetchJSON";
import useLoading from "@/src/tools/UseLoading";

export default function UserApi() {
  const { loading, error, response } = useLoading(
    async () =>
      await fetchJSON(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
  );

  return { loading, error, response };
}
