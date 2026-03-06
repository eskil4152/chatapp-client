"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterAPI from "@/src/api/RegisterAPI";
import styles from "../../style/Auth.module.css";

export default function Page() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await RegisterAPI(username, password);

    if (data.status === 201) {
      router.replace("/");
    } else if (data.status === 409) {
      setError("Username is taken");
    } else {
      setError("An error occurred");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Register</h1>

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

          <button className={styles.button}>Register</button>

          <button
            type="button"
            className={styles.showPassword}
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? "Hide Password" : "Show Password"}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}
