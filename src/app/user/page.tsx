"use client";

import UserAPI from "@/src/api/UserAPI";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import EditProfileAPI from "@/src/api/EditProfileAPI";
import { useRouter } from "next/navigation";
import styles from "../../style/User.module.css";
import Link from "next/link";
import { white } from "next/dist/lib/picocolors";

export default function UserInfo() {
  const router = useRouter();

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

  const [editing, setEditing] = useState(false);
  const [errorBox, setErrorBox] = useState("");

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

  if (response?.status == 401) router.replace("/login");
  else if (response?.status !== 200)
    return <p>Failed to load user. Status: {response?.status}</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await EditProfileAPI(form);

    if (res.ok) {
      setEditing(false);
      router.refresh();
    } else {
      setErrorBox("Error editing user");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button onClick={() => setEditing(!editing)} className={styles.button}>
          {editing ? "Cancel" : "Edit profile"}
        </button>

        <div className={styles.field}>
          <label className={styles.label}>Username</label>
          <div className={styles.valueBox}>{username}</div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Bio</label>
            {editing ? (
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className={styles.bioBox}
              />
            ) : (
              <div className={styles.valueBox}>{form.bio || "—"}</div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            {editing ? (
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
              />
            ) : (
              <div className={styles.valueBox}>{form.email || "—"}</div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            {editing ? (
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className={styles.input}
              />
            ) : (
              <div className={styles.valueBox}>{form.fullName || "—"}</div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Avatar URL</label>
            {editing ? (
              <input
                type="text"
                name="avatarUrl"
                value={form.avatarUrl}
                onChange={handleChange}
                className={styles.input}
              />
            ) : validAvatar(form.avatarUrl) ? (
              <div className={styles.imageBox}>
                <Image
                  src={form.avatarUrl}
                  alt="Avatar"
                  width={400}
                  height={400}
                />
              </div>
            ) : (
              <div className={styles.valueBox}>No image</div>
            )}
          </div>

          {editing && (
            <button type="submit" className={styles.button}>
              Save
            </button>
          )}
        </form>

        <Link href="/user/password">Change Password</Link>

        {errorBox && <p id="errorBox">{errorBox}</p>}
      </div>
    </div>
  );
}
