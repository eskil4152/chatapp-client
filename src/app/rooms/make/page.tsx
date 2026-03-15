"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MakeRoomAPI from "@/src/api/rooms/MakeRoomAPI";

export default function AddRoom() {
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [encryption, setEncryption] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await MakeRoomAPI(roomName, encryption);

    if (data.status === 201) {
      router.replace("/rooms");
    } else if (data.status === 401) {
      router.replace("/login");
    } else if (data.status === 400) {
      setError("Invalid room name");
    }
  }

  return (
    <div className="pageShellNarrow">
      <div className="card">
        <h1 className="pageTitle">Create Room</h1>

        <form onSubmit={handleSubmit} className="formStack">
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setEncryption(!encryption)}
            className={`secondaryButton ${encryption ? "activeToggle" : ""}`}
          >
            Encryption: {encryption ? "Enabled" : "Disabled"}
          </button>

          <button className="primaryButton">Create</button>
        </form>

        {error && <p className="errorBox">{error}</p>}
      </div>
    </div>
  );
}
