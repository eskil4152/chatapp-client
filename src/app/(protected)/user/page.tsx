"use client";

import useUser from "@/src/features/user/hooks/useUser";
import React, { useState } from "react";
import Image from "next/image";
import editProfile from "@/src/features/user/api/editProfile";
import { useRouter } from "next/navigation";
import styles from "@/src/style/modules/User.module.css";
import Link from "next/link";
import logout from "@/src/features/auth/api/logout";
import deleteUser from "@/src/features/user/api/deleteUser";
import ConfirmPopup from "@/src/shared/components/ConfirmPopup";

type UserData = {
  username: string;
  bio?: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
};

function validAvatar(link: string) {
  return link.startsWith("http://") || link.startsWith("https://");
}

export default function UserInfo() {
  const router = useRouter();
  const { loading, error, response } = useUser();

  if (loading) {
    return (
      <div className="pageShellNarrow">
        <div className="card centerText">
          <p className="loadingText">Loading...</p>
        </div>
      </div>
    );
  }

  if (response?.status === 401) {
    router.replace("/login");
    return null;
  }

  if (error || response?.status !== 200) {
    return (
      <div className="pageShellNarrow">
        <div className="card centerText">
          <p className="errorBox">Failed to load user.</p>
        </div>
      </div>
    );
  }

  return <UserInfoForm data={response.data as UserData} />;
}

function UserInfoForm({ data }: { data: UserData }) {
  const router = useRouter();

  const [form, setForm] = useState({
    bio: data.bio || "",
    email: data.email || "",
    fullName: data.fullName || "",
    avatarUrl: data.avatarUrl || "",
  });

  const [editing, setEditing] = useState(false);
  const [errorBox, setErrorBox] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await editProfile(form);

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
      {confirmDelete && (
        <ConfirmPopup
          message="Are you sure you want to delete your account? This cannot be undone."
          confirmLabel="Yes, delete"
          onConfirm={async () => {
            await deleteUser().then(() => router.push("/login"));
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      <div className="card">
        <div className={styles.actions}>
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
          <div className={styles.valueBox}>{data.username}</div>
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
            <label className={styles.label}>
              {editing ? "Avatar URL" : "Avatar"}
            </label>
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
                  width={250}
                  height={250}
                  className={styles.profileImage}
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

        <div className={styles.actions}>
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
              await logout().then(() => router.push("/login"));
            }}
          >
            Log out
          </button>
        </div>

        <hr className="divider" />

        <div className={styles.actions}>
          <button
            type="button"
            className="dangerButton"
            onClick={() => setConfirmDelete(true)}
          >
            Delete User
          </button>
        </div>

        {errorBox && <p className="errorBox">{errorBox}</p>}
      </div>
    </div>
  );
}
