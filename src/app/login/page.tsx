"use client";

import Link from "next/link";
import LogInAPI from "@/src/api/LoginAPI";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../style/Auth.module.css";

export default function Page() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await LogInAPI(username, password);

    if (data.status === 200) {
      router.replace("/rooms");
    } else if (data.status === 401) {
      setError("Credentials not found.");
    } else {
      setError("An error occurred");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Log In</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Username / Email"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className={styles.button}>Log In</button>

          <button
            type="button"
            className={styles.showPassword}
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? "Hide Password" : "Show Password"}
          </button>
        </form>

        <hr className={styles.divider} />

        <Link className={styles.linkButton} href="/register">
          Register
        </Link>

        {error && <p id="errorBox">{error}</p>}
      </div>
    </div>
  );
}
