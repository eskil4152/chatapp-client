"use client";

import UserAPI from "@/src/api/UserAPI";

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
      <div>
        <p>{username}</p>
        <p>{bio}</p>
        <p>{email}</p>
        <p>{fullName}</p>
        <p>{avatarUrl}</p>
        <p>{birthday}</p>
        <p>{createdAt}</p>
        <p>{friends}</p>
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
