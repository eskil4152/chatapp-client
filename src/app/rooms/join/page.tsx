"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import JoinRoomAPI from "@/src/api/JoinRoomAPI";
import styles from "../../../style/JoinRoom.module.css";

export default function JoinRoom() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await JoinRoomAPI(roomId);

    console.log(data);
    console.log(data.status);
    console.log(data.statusText);

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

        {error && <p id="errorBox">{error}</p>}
      </div>
    </div>
  );
}
