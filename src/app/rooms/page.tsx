"use client";

import useRooms from "@/src/features/rooms/hooks/useRooms";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OwnerRoomCard } from "@/src/features/rooms/components/OwnerRoomCard";
import RoomCard from "@/src/features/rooms/components/RoomCard";
import FriendRoomCard from "@/src/features/rooms/components/FriendRoomCard";
import { RoomType } from "@/src/features/rooms/types";

export default function Rooms() {
  const router = useRouter();

  const { loading, error, response } = useRooms();
  const [rooms, setRooms] = useState<RoomType[]>([]);

  useEffect(() => {
    if (response?.status === 401) {
      router.replace("/login");
    }
  }, [response, router]);

  useEffect(() => {
    if (response?.status === 200) {
      setRooms((response.data as RoomType[]) ?? []);
    }
  }, [response]);

  const joinedRooms = rooms.filter(
    (room) => room.type !== "PRIVATE" && room.role !== "OWNER",
  );

  const ownedRooms = rooms.filter((room) => room.role === "OWNER");

  const privateRooms = rooms.filter((room) => room.type === "PRIVATE");

  return (
    <div className="pageList">
      {loading && <p className="empty">Loading...</p>}
      {!loading && !!error && <p className="errorBox">Failed to load rooms</p>}
      {!loading && !error && rooms.length === 0 && <p className="empty">No rooms :(</p>}

      {ownedRooms.length > 0 && (
        <>
          <h2 className="sectionTitle">Owned Rooms</h2>
          <div className="itemList">
            {ownedRooms.map((room) => (
              <OwnerRoomCard
                key={room.roomId}
                roomId={room.roomId}
                roomName={room.roomName}
                encrypted={room.encrypted}
                type={room.type}
                role={room.role}
              />
            ))}
          </div>
        </>
      )}

      {joinedRooms.length > 0 && (
        <>
          <h2 className="sectionTitle">Joined Rooms</h2>
          <div className="itemList">
            {joinedRooms.map((room) => (
              <RoomCard key={room.roomId} {...room} onLeave={handleLeave} />
            ))}
          </div>
        </>
      )}

      {privateRooms.length > 0 && (
        <>
          <h2 className="sectionTitle">Private Rooms</h2>
          <div className="itemList">
            {privateRooms.map((room) => (
              <FriendRoomCard
                key={room.roomId}
                roomId={room.roomId}
                roomName={room.roomName}
                encrypted={room.encrypted}
                type={room.type}
                role={room.role}
              />
            ))}
          </div>
        </>
      )}

      <hr className="divider" />

      <div className="pageActions">
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
