"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MakeRoomAPI from "@/src/api/MakeRoomAPI";
import styles from "../../../style/MakeRoom.module.css";

export default function AddRoom() {
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [encryption, setEncryption] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await MakeRoomAPI(roomName, encryption);

    if (data.status === 201) {
      router.replace("/rooms");
    } else if (data.status === 401) {
      router.replace("/login");
    } else {
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Room</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Room Name"
            className={styles.input}
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setEncryption(!encryption)}
            className={`${styles.toggle} ${
              encryption ? styles.toggleActive : ""
            }`}
          >
            Encryption: {encryption ? "Enabled" : "Disabled"}
          </button>

          <button className={styles.button}>Create</button>
        </form>
      </div>
    </div>
  );
}
