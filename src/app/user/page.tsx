"use client";

import UserAPI from "@/src/api/UserAPI";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function UserInfo() {
  function validAvatar(link: string) {
    return link.startsWith("http") || link.startsWith("https");
  }

  const { loading, error, response } = UserAPI();
  const [username, setUsername] = useState("");

  const [form, setForm] = useState({
    bio: "",
    email: "",
    fullName: "",
    avatarUrl: "",
  });

  const [editing, setEditing] = useState(false); // toggle edit mode

  useEffect(() => {
    if (response?.status === 200) {
      const { username, bio, email, fullName, avatarUrl } = response.data;
      setUsername(username);

      setForm({
        bio: bio || "",
        email: email || "",
        fullName: fullName || "",
        avatarUrl: avatarUrl || "",
      });
    }
  }, [response]);

  if (loading) return <p>Loading...</p>;
  if (!response || response.status !== 200)
    return <p>Failed to load user. Status: {response?.status}</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/user/edit`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      },
    );
    if (res.ok) {
      alert("Profile updated!");
      setEditing(false); // return to read-only
    } else {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="text-center user-info">
      <button
        onClick={() => setEditing(!editing)}
        className="border-2 border-black px-4 rounded mt-2"
      >
        {editing ? "Cancel" : "Edit profile"}
      </button>

      <div>
        <label>Username:</label>
        <p className="font-bold">{username}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 max-w-md mx-auto mt-2"
      >
        <label>
          Bio:
          {editing ? (
            <textarea name="bio" value={form.bio} onChange={handleChange} />
          ) : (
            <p>{form.bio || "—"}</p>
          )}
        </label>

        <label>
          Email:
          {editing ? (
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          ) : (
            <p>{form.email || "—"}</p>
          )}
        </label>

        <label>
          Full Name:
          {editing ? (
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
          ) : (
            <p>{form.fullName || "—"}</p>
          )}
        </label>

        <label>
          Avatar URL:
          {editing ? (
            <input
              type="text"
              name="avatarUrl"
              value={form.avatarUrl}
              onChange={handleChange}
            />
          ) : (
            <>
              {validAvatar(form.avatarUrl) ? (
                <Image
                  src={form.avatarUrl}
                  alt="Image not found"
                  width={400}
                  height={400}
                />
              ) : (
                <p>No image</p>
              )}
            </>
          )}
        </label>

        {editing && (
          <button
            type="submit"
            className="border-2 border-black px-4 rounded mt-2"
          >
            Save
          </button>
        )}
      </form>
    </div>
  );
}
