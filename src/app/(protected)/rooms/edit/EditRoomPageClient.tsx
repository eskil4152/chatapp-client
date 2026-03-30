"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import editRoom from "@/src/features/rooms/api/editRoom";
import deleteRoom from "@/src/features/rooms/api/deleteRoom";

export default function EditRoomPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roomId = searchParams.get("id");

  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!roomId) {
      setError("Invalid room");
      return;
    }

    const data = await editRoom(roomId, roomName);

    if (data.status === 200) {
      router.replace("/rooms");
    } else if (data.status === 401) {
      router.replace("/login");
    } else if (data.status === 403) {
      setError("You cannot edit this room");
    } else if (data.status === 400) {
      setError("Invalid room name");
    } else {
      setError("Something failed");
    }
  }

  return (
    <div className="pageShellNarrow">
      <div className="card">
        <h1 className="pageTitle">Edit Room</h1>

        <form onSubmit={handleSubmit} className="formStack">
          <input
            type="text"
            placeholder="New Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />

          <button
            className="primaryButton"
            disabled={roomName.trim().length === 0}
          >
            Save
          </button>
        </form>

        <button
          type="button"
          className="dangerButton"
          onClick={async () => {
            if (!roomId) {
              setError("Invalid room");
              return;
            }

            const res = await deleteRoom(roomId);

            if (res.ok) {
              router.push("/rooms");
            } else if (res.status === 401) {
              router.replace("/login");
            } else if (res.status === 403) {
              setError("You cannot delete this room");
            } else {
              setError("Could not delete room");
            }
          }}
        >
          Delete Room
        </button>

        {error && <p className="errorBox">{error}</p>}
      </div>
    </div>
  );
}
