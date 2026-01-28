"use client";

import React, { useState } from "react";
import { redirect } from "next/navigation";
import JoinRoomAPI from "@/src/api/JoinRoomAPI";

export default function AddRoom() {
  const [roomId, setRoomId] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await JoinRoomAPI(roomId);

    if (data.status === 200) {
      redirect("/");
    } else if (data.status === 401) {
    } else {
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="roomId"
          width={10}
          height={5}
          placeholder="Room ID"
          className="border-2 border-black my-2 p-[3px] dark:text-black"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <br />

        <div className="flex justify-center gap-10">
          <button className="border-2 border-black px-4 rounded-full mt-2 dark:border-white">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
