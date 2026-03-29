"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import joinRoom from "@/src/features/rooms/api/joinRoom";

export default function JoinRoom() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await joinRoom(roomId);

    if (data.status === 200) {
      router.replace("/");
    } else if (data.status === 401) {
      router.replace("/login");
    } else if (data.status === 400) {
      setError("Invalid ID");
    } else if (data.status === 404) {
      setError("Room Not Found");
    }
  }

  return (
    <div className="pageShellNarrow">
      <div className="card">
        <h1 className="pageTitle">Join Room</h1>

        <form onSubmit={handleSubmit} className="formStack">
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <button className="primaryButton">Join</button>
        </form>

        {error && <p className="errorBox">{error}</p>}
      </div>
    </div>
  );
}
