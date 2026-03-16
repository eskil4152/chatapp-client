"use client";

import GetRoomsAPI from "@/src/api/rooms/GetRoomsAPI";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../style/modules/Rooms.module.css";
import { OwnerRoomCard } from "@/src/components/cards/OwnerRoomCard";
import RoomCard from "@/src/components/cards/RoomCard";
import FriendRoomCard from "@/src/components/cards/FriendRoomCard";

export default function Rooms() {
  const router = useRouter();

  const { loading, error, response } = GetRoomsAPI();
  const [rooms, setRooms] = useState<RoomType[]>([]);

  useEffect(() => {
    if (response?.status === 401) {
      router.replace("/login");
    }
  }, [response, router]);

  useEffect(() => {
    if (response?.status === 200) {
      setRooms(response.data ?? []);
    }
  }, [response]);

  const joinedRooms = rooms.filter(
    (room) => room.type !== "PRIVATE" && room.role !== "OWNER",
  );

  const ownedRooms = rooms.filter((room) => room.role === "OWNER");

  const privateRooms = rooms.filter((room) => room.type === "PRIVATE");

  return (
    <div className={styles.container}>
      {rooms.length === 0 && <p className={styles.empty}>No rooms :(</p>}

      {ownedRooms.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>Owned Rooms</h2>

          <div className={styles.roomList}>
            {ownedRooms.map((room) => (
              <OwnerRoomCard
                roomId={room.roomId}
                roomName={room.roomName}
                encrypted={room.encrypted}
                type={room.type}
                role={room.role}
                key={room.roomId}
              />
            ))}
          </div>
        </>
      )}

      {joinedRooms.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>Joined Rooms</h2>

          <div className={styles.roomList}>
            {joinedRooms.map((room) => (
              <RoomCard key={room.roomId} {...room} onLeave={handleLeave} />
            ))}
          </div>
        </>
      )}

      {privateRooms.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>Private Rooms</h2>

          <div className={styles.roomList}>
            {privateRooms.map((room) => (
              <FriendRoomCard
                roomId={room.roomId}
                roomName={room.roomName}
                encrypted={room.encrypted}
                type={room.type}
                role={room.role}
                key={room.roomId}
              />
            ))}
          </div>
        </>
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

  function handleLeave(roomId: string) {
    setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
  }
}
