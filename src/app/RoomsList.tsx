"use client";

import { useRouter } from "next/navigation";

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

          <p>Add a room</p>
        </div>
      ))}
    </div>
  );
}
