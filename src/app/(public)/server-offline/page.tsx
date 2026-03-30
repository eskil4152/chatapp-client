"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ServerOfflinePage() {
  const router = useRouter();

  const check = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/auth`, {
        credentials: "include",
      });
      router.replace("/");
    } catch {}
  };

  useEffect(() => {
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pageShellNarrow">
      <div className="card centerText">
        <p className="errorBox">Server is temporarily offline.</p>
        <button className="primaryButton" onClick={check}>
          Try again
        </button>
      </div>
    </div>
  );
}
