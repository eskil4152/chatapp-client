"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeClient() {
  const router = useRouter();

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_SERVER_API_URL;

    if (!base) {
      router.replace("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/auth`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => {
        router.replace(res.ok ? "/rooms" : "/login");
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  return null;
}
