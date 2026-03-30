"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useLoading from "@/src/shared/hooks/useLoading";
import fetchJSON from "@/src/shared/lib/fetchJSON";

export default function HomeClient() {
  const router = useRouter();
  const base = process.env.NEXT_PUBLIC_SERVER_API_URL;

  const { loading, error, response } = useLoading(async () =>
    fetchJSON(`${base}/api/auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }),
  );

  useEffect(() => {
    if (loading) return;

    if (error) {
      router.replace("/server-offline");
      return;
    }

    router.replace(response?.status === 200 ? "/rooms" : "/login");
  }, [loading, error, response, router]);

  if (loading) {
    return (
      <div className="pageShellNarrow">
        <div className="card centerText">
          <p className="loadingText">
            Waking server from deep slumber… please wait.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
