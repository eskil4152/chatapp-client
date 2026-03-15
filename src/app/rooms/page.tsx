"use client";

import GetRoomsAPI from "@/src/api/rooms/GetRoomsAPI";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../style/Rooms.module.css";
import LeaveRoomAPI from "@/src/api/rooms/LeaveRoomAPI";

export default function Rooms() {
  const router = useRouter();

  type Room = {
    roomId: string;
    roomName: string;
    encrypted: boolean;
    role: string;
    type: string;
  };

  const { loading, error, response } = GetRoomsAPI();
  const [rooms, setRooms] = useState<Room[]>([]);

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

  const ownedRooms = rooms.filter(
    (r) => r.role === "OWNER" && r.type === "GROUP",
  );
  const joinedRooms = rooms.filter(
    (r) => r.role === "MEMBER" && r.type === "GROUP",
  );
  const privateRooms = rooms.filter((r) => r.type === "PRIVATE");

  return (
    <div className={styles.container}>
      {rooms.length === 0 && <p className={styles.empty}>No rooms :(</p>}

      {ownedRooms.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>Owned Rooms</h2>

          <div className={styles.roomList}>
            {ownedRooms.map((room) => (
              <div key={room.roomId} className={styles.roomRow}>
                <button
                  className={styles.roomCard}
                  onClick={() => router.replace(`/chat?id=${room.roomId}`)}
                >
                  <div className={styles.roomCardLeft}>
                    <div className={styles.roomName}>{room.roomName}</div>
                  </div>

                  <div className={styles.roomCardRight}>
                    <span className={styles.roomMeta}>
                      {room.encrypted ? "Encrypted" : "Not encrypted"}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className={styles.optionsButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/rooms/edit?id=${room.roomId}`);
                  }}
                >
                  Edit room
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {joinedRooms.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>Joined Rooms</h2>

          <div className={styles.roomList}>
            {joinedRooms.map((room) => (
              <div key={room.roomId} className={styles.roomRow}>
                <button
                  className={styles.roomCard}
                  onClick={() => router.replace(`/chat?id=${room.roomId}`)}
                >
                  <div className={styles.roomCardLeft}>
                    <div className={styles.roomName}>{room.roomName}</div>
                  </div>

                  <div className={styles.roomCardRight}>
                    <span className={styles.roomMeta}>
                      {room.encrypted ? "Encrypted" : "Not encrypted"}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className={styles.optionsButton}
                  onClick={async (e) => {
                    e.stopPropagation();
                    const res = await LeaveRoomAPI(room.roomId);

                    if (res.ok) {
                      setRooms((prev) =>
                        prev.filter((r) => r.roomId !== room.roomId),
                      );
                    } else if (res.status === 401) {
                      router.replace("/login");
                    }
                  }}
                >
                  Leave
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {privateRooms.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>Private Rooms</h2>

          <div className={styles.roomList}>
            {privateRooms.map((room) => (
              <div key={room.roomId} className={styles.roomRow}>
                <button
                  className={styles.roomCard}
                  onClick={() => router.replace(`/chat?id=${room.roomId}`)}
                >
                  <div className={styles.roomCardLeft}>
                    <div className={styles.roomName}>{room.roomName}</div>
                  </div>
                </button>
              </div>
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
}
