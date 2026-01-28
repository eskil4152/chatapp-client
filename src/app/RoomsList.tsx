"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

type Room = {
  id: string;
  name: string;
};

export default function RoomsList({ rooms }: { rooms: Room[] }) {
  const router = useRouter();

  /*return (
    <ul>
      {rooms.map((room) => (
        <li
          key={room.id}
          onClick={() => router.push(`/rooms/${room.id}`)}
          style={{ cursor: "pointer" }}
        >
          {room.name}
        </li>
      ))}
    </ul>
  );*/

  if (rooms.length === 0) {
    return (
      <div>
        <p>No rooms :(</p>

        <Link
          className="text-center border-2 border-black px-4 rounded-full mt-2 dark:border-white"
          href={{
            pathname: "/room/join",
          }}
        >
          <p>Join a room</p>
        </Link>

        <Link
          className="text-center border-2 border-black px-4 rounded-full mt-2 dark:border-white"
          href={{
            pathname: "/room/make",
          }}
        >
          <p>Make a new room</p>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {rooms.map((room) => (
        <div
          key={room.id}
          onClick={() => {
            router.push(`/chat/${room.id}`);
          }}
        >
          <h4>{room.name}</h4>
          <button>Enter room</button>
          <hr />

          <br />
        </div>
      ))}

      <Link
        className="text-center border-2 border-black px-4 rounded-full mt-2 dark:border-white"
        href={{
          pathname: "/room/join",
        }}
      >
        <p>Join a room</p>
      </Link>

      <Link
        className="text-center border-2 border-black px-4 rounded-full mt-2 dark:border-white"
        href={{
          pathname: "/room/make",
        }}
      >
        <p>Make a new room</p>
      </Link>
    </div>
  );
}
