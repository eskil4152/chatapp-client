"use client";

import GetRoomsAPI from "@/src/api/GetRoomsAPI";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../style/Rooms.module.css";

export default function Rooms() {
  const router = useRouter();

  type Room = {
    id: string;
    name: string;
  };

  const { loading, error, response } = GetRoomsAPI();

  useEffect(() => {
    if (response?.status === 401) {
      router.replace("/login");
    }
  }, [response, router]);

  if (loading) return <p className={styles.empty}>Loading...</p>;
  if (error) return <p className={styles.empty}>Something failed</p>;
  if (!response) return <p className={styles.empty}>Unknown error</p>;

  const rooms: Room[] = response.data ?? [];

  return (
    <div className={styles.container}>
      {rooms.length === 0 ? (
        <p className={styles.empty}>No rooms :(</p>
      ) : (
        <div className={styles.roomList}>
          {rooms.map((room) => (
            <button
              key={room.id}
              className={styles.roomCard}
              onClick={() => router.replace(`/chat?id=${room.id}`)}
            >
              <div className={styles.roomName}>{room.name}</div>
            </button>
          ))}
        </div>
      )}

      <hr className="divider" />

      <div className={styles.actions}>
        <Link href="/rooms/join" className="primaryButton">
          Join Room
        </Link>

        <Link href="/rooms/make" className="primaryButton">
          Create Room
        </Link>
      </div>
    </div>
  );
}
