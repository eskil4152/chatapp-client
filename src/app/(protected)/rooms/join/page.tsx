"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import respondToInvite from "@/src/features/invites/api/respondToInvite";

export default function JoinRoom() {
  const router = useRouter();
  const [inviteId, setInviteId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = await respondToInvite(inviteId.trim(), "ACCEPTED");

    if (data.status === 200) {
      router.replace("/rooms");
    } else if (data.status === 401) {
      router.replace("/login");
    } else if (data.status === 403) {
      setError("You are banned from this room.");
    } else if (data.status === 409) {
      setError("You are already in this room.");
    } else if (data.status === 404) {
      setError("Invite not found or expired.");
    } else if (data.status === 400) {
      setError("Invalid invite ID.");
    } else {
      setError("An error occurred.");
    }
    setLoading(false);
  }

  return (
    <div className="pageShellNarrow">
      <div className="card">
        <h1 className="pageTitle">Join Room</h1>

        <form onSubmit={handleSubmit} className="formStack">
          <input
            type="text"
            placeholder="Invite ID"
            value={inviteId}
            onChange={(e) => setInviteId(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`primaryButton ${loading ? "buttonLoading" : ""}`}
          >
            {loading ? "Joining…" : "Join"}
          </button>
        </form>

        {error && <p className="errorBox">{error}</p>}
      </div>
    </div>
  );
}
