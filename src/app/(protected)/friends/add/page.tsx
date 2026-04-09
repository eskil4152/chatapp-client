"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import sendFriendRequest from "@/src/features/invites/api/sendFriendRequest";

export default function Page() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = await sendFriendRequest(username);

    if (data.status === 200) {
      router.replace("/friends");
    } else if (data.status === 404) {
      setError("User not found.");
    } else if (data.status === 409) {
      setError("Already friends or request already sent.");
    } else {
      setError("An error occurred");
    }
    setLoading(false);
  }

  return (
    <div className="pageShellNarrow">
      <div className="card">
        <h1 className="pageTitle">Add friend</h1>

        <form onSubmit={handleSubmit} className="formStack">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`primaryButton ${loading ? "buttonLoading" : ""}`}
          >
            {loading ? "Sending…" : "Send request"}
          </button>
        </form>

        {error && <p className="errorBox">{error}</p>}
      </div>
    </div>
  );
}
