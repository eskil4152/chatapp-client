"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import JoinRoomAPI from "@/src/api/JoinRoomAPI";
import styles from "../../../style/JoinRoom.module.css";

export default function AddRoom() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await JoinRoomAPI(roomId);

    if (data.status === 200) {
      router.replace("/");
    } else if (data.status === 401) {
    } else {
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Join Room</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Room ID"
            className={styles.input}
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <button className={styles.button}>Join</button>
        </form>
      </div>
    </div>
  );
}
