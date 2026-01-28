"use client";

import React, { useState } from "react";
import { redirect } from "next/navigation";
import MakeRoomAPI from "@/src/api/MakeRoomAPI";

export default function AddRoom() {
  const [roomName, setRoomName] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await MakeRoomAPI(roomName);

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
          id="roomName"
          width={10}
          height={5}
          placeholder="Room Name"
          className="border-2 border-black my-2 p-[3px] dark:text-black"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />

        <br />

        <div className="flex justify-center gap-10">
          <button className="border-2 border-black px-4 rounded-full mt-2 dark:border-white">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
