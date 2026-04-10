"use client";

import useRooms from "@/src/features/rooms/hooks/useRooms";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OwnerRoomCard } from "@/src/features/rooms/components/OwnerRoomCard";
import RoomCard from "@/src/features/rooms/components/RoomCard";
import FriendRoomCard from "@/src/features/rooms/components/FriendRoomCard";
import { RoomType } from "@/src/features/rooms/types";
import { useAppSocket } from "@/src/shared/providers/AppSocketProvider";

export default function Rooms() {
  const router = useRouter();

  const { subscribe } = useAppSocket();
  const { loading, error, response } = useRooms();
  const [rooms, setRooms] = useState<RoomType[]>([]);

  useEffect(() => {
    return subscribe((data) => {
      if (data.type === "ROOM_DELETED") {
        setRooms((prev) => prev.filter((room) => room.roomId !== data.roomId));
        return;
      }
    });
  }, [subscribe]);

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

  const manageableRoles = ["OWNER", "ADMIN", "MODERATOR"];

  const manageableRooms = rooms.filter(
    (room) => room.type !== "PRIVATE" && manageableRoles.includes(room.role),
  );

  const joinedRooms = rooms.filter(
    (room) => room.type !== "PRIVATE" && !manageableRoles.includes(room.role),
  );

  const privateRooms = rooms.filter((room) => room.type === "PRIVATE");

  return (
    <div className="pageList">
      {loading && <p className="empty">Loading...</p>}
      {!loading && !!error && <p className="errorBox">Failed to load rooms</p>}
      {!loading && !error && rooms.length === 0 && (
        <p className="empty">No rooms :(</p>
      )}

      {manageableRooms.length > 0 && (
        <>
          <h2 className="sectionTitle">Managed Rooms</h2>
          <div className="itemList">
            {manageableRooms.map((room) => (
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
