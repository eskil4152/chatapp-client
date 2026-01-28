"use client";

import UserAPI from "@/src/api/UserAPI";
import "@/src/style/UserPage.css";
import { forEach } from "eslint-config-next";

export default function UserInfo() {
  const { loading, error, response } = UserAPI();

  while (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (response?.status === 200) {
    const {
      username,
      bio,
      email,
      fullName,
      avatarUrl,
      birthday,
      createdAt,
      rooms,
      friends,
    } = response.data;

    return (
      <div className="text-center user-info">
        <div>
          <p>Username:</p>
          <p>{username}</p>
        </div>
        <div>
          <p>Bio</p>
          <p>{bio}</p>
        </div>
        <div>
          <p>Email</p>
          <p>{email}</p>
        </div>
        <div>
          <p>Full name</p>
          <p>{fullName}</p>
        </div>
        <div>
          <p>Avatar</p>
          <p>{avatarUrl}</p>
        </div>
        <div>
          <p>Birthday</p>
          <p>{birthday}</p>
        </div>
        <div>
          <p>Friends</p>
          <p>{friends}</p>
        </div>
        <div>
          <p>Rooms:</p>
          {rooms && rooms.length > 0 ? (
            rooms.map((room: { id: string; name: string }) => (
              <p key={room.id}>{room.name}</p>
            ))
          ) : (
            <p>No rooms</p>
          )}
        </div>
        <div>
          <p>Member since</p>
          <p>{createdAt}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <p>Not 200. Was ${response?.status}</p>
      </div>
    );
  }
}
