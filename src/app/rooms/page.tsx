"use client";

import GetRoomsAPI from "@/src/api/GetRoomsAPI";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Rooms() {
  const router = useRouter();

  type Room = {
    id: string;
    name: string;
  };

  const { loading, error, response } = GetRoomsAPI();

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) return <p>Something failed: {String(error)}</p>;

  if (!response) return <p>Unknown error</p>;

  if (response.status === 401) {
    router.replace("/login");
  } else if (response.status !== 200)
    return <p>Request failed. Status: {response.status}</p>;

  const rooms: Room[] = response.data ?? [];

  return (
    <div className="flex flex-col gap-3">
      {rooms.length === 0 ? (
        <p>No rooms :(</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rooms.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => router.replace(`/chat?id=${room.id}`)}
            >
              <div className="font-semibold">{room.name}</div>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Link href="/rooms/join">Join a room</Link>
        <br />
        <Link href="/rooms/make">Make a new room</Link>
      </div>
    </div>
  );
}
