"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AddFriendAPI from "@/src/api/friends/AddFriendAPI";

export default function Page() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await AddFriendAPI(username);

    if (data.status === 200) {
      router.replace("/friends");
    } else if (data.status === 404) {
      setError("User not found.");
    } else if (data.status === 409) {
      setError("You are already friends with this user.");
    } else {
      setError("An error occurred");
    }
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

          <button className="primaryButton">Add</button>
        </form>

        {error && <p className="errorBox">{error}</p>}
      </div>
    </div>
  );
}
