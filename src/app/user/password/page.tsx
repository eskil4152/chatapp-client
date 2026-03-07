"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../style/ChangePassword.module.css";
import ChangePasswordAPI from "@/src/api/ChangePasswordAPI";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [old, setOld] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await ChangePasswordAPI(old, password);

    if (data.ok) {
      return (
        <div>
          <p>OK</p>
        </div>
      );
    } else if (data.status === 401) {
      router.replace("/login");
    } else if (!data.ok) {
      const err = await data.json();
      setError(err.message);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Change Password</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          placeholder="Old password"
          className={styles.input}
          value={old}
          onChange={(e) => setOld(e.target.value)}
        />

        <input
          type="password"
          placeholder="New password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.button}>Create</button>
      </form>
      {error && <p id="errorBox">{error}</p>}
    </div>
  );
}
