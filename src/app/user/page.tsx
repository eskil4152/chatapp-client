"use client";

import UserAPI from "@/src/api/UserAPI";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import EditProfileAPI from "@/src/api/EditProfileAPI";
import { useRouter } from "next/navigation";
import styles from "../../style/User.module.css";
import Link from "next/link";
import LogoutAPI from "@/src/api/LogoutAPI";

export default function UserInfo() {
  const router = useRouter();

  function validAvatar(link: string) {
    return link.startsWith("http://") || link.startsWith("https://");
  }

  const { loading, response } = UserAPI();
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

  useEffect(() => {
    if (response?.status === 401) {
      router.replace("/login");
    }
  }, [response, router]);

  if (loading) {
    return (
      <div className="pageShellNarrow">
        <div className="card centerText">
          <p className="loadingText">Loading...</p>
        </div>
      </div>
    );
  }

  if (response?.status === 401) return null;

  if (response?.status !== 200) {
    return (
      <div className="pageShellNarrow">
        <div className="card centerText">
          <p className="errorBox">
            Failed to load user. Status: {response?.status}
          </p>
        </div>
      </div>
    );
  }

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
      setErrorBox("");
      router.refresh();
    } else {
      setErrorBox("Error editing user");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.topActions}>
          <button
            onClick={() => setEditing(!editing)}
            className="secondaryButton"
            type="button"
          >
            {editing ? "Cancel" : "Edit profile"}
          </button>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Username</label>
          <div className={styles.valueBox}>{username}</div>
        </div>

        <form onSubmit={handleSubmit}>
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
            <button type="submit" className="primaryButton">
              Save
            </button>
          )}
        </form>

        <div className={styles.bottomActions}>
          <Link
            href="/user/password"
            className={`secondaryButton ${styles.passwordLink}`}
          >
            Change Password
          </Link>

          <button
            type="button"
            className="dangerButton"
            onClick={async () => {
              await LogoutAPI().then(() => router.push("/login"));
            }}
          >
            Log out
          </button>
        </div>

        {errorBox && <p className="errorBox">{errorBox}</p>}
      </div>
    </div>
  );
}
