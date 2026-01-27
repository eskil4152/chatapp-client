"use client";

import { useRouter } from "next/navigation";

type Room = {
  id: string;
  name: string;
};

export default function RoomsList({ rooms }: { rooms: Room[] }) {
  const router = useRouter();

  return (
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
  );
}
