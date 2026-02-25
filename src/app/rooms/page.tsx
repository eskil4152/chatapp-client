"use client";

import GetRoomsAPI from "@/src/api/GetRoomsAPI";
import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

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

    if (res.length > 0) {
      return (
        <div>
          {res.map((room: Room) => (
            <div
              key={room.id}
              onClick={() => {
                redirect(`/chat?id=${room.id}`);
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
              pathname: "/rooms/join",
            }}
          >
            <p>Join a room</p>
          </Link>
          <Link
            className="text-center border-2 border-black px-4 rounded-full mt-2 dark:border-white"
            href={{
              pathname: "/rooms/make",
            }}
          >
            <p>Make a new room</p>
          </Link>
        </div>
      );
    } else {
      return (
        <div>
          <p>No rooms :(</p>
          <Link
            className="text-center border-2 border-black px-4 rounded-full mt-2 dark:border-white"
            href={{
              pathname: "/rooms/join",
            }}
          >
            <p>Join a room</p>
          </Link>
          <Link
            className="text-center border-2 border-black px-4 rounded-full mt-2 dark:border-white"
            href={{
              pathname: "/rooms/make",
            }}
          >
            <p>Make a new room</p>
          </Link>
        </div>
      );
    }
  } else {
    return (
      <div>
        <p>Not 200. Was {response?.status}</p>
      </div>
    );
  }
}
