"use client";

import GetRoomsAPI from "@/src/api/GetRoomsAPI";
import React from "react";
import { redirect } from "next/navigation";

export default function Rooms() {
  type Room = {
    id: string;
    name: string;
  };

  const { loading, error, response } = GetRoomsAPI();

  while (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (response?.status === 200) {
    const res = response.data;

    console.log(res);

    return res.map((room: Room) => (
      <div
        key={room.id}
        onClick={() => {
          redirect(`/chat/${room.id}`);
        }}
      >
        <h4>{room.name}</h4>
        <button>Enter room</button>
        <hr />

        <br />
      </div>
    ));
  } else {
    return (
      <div>
        <p>Not 200. Was {response?.status}</p>
      </div>
    );
  }
}
