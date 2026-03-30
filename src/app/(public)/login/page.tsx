"use client";

import Link from "next/link";
import login from "@/src/features/auth/api/login";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await login(username, password);

    if (data.status === 200) {
      router.replace("/rooms");
    } else if (data.status === 401) {
      setError("Credentials not found.");
    } else {
      setError("An error occurred");
    }
  }

  return (
    <div className="pageShellNarrow">
      <div className="card">
        <h1 className="pageTitle">Log In</h1>

        <form onSubmit={handleSubmit} className="formStack">
          <input
            type="text"
            placeholder="Username / Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="primaryButton">Log In</button>

          <button
            type="button"
            className="textButton"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? "Hide Password" : "Show Password"}
          </button>
        </form>

        <hr className="divider" />

        <Link className="secondaryButton" href="/register">
          Register
        </Link>

        {error && <p className="errorBox">{error}</p>}
      </div>
    </div>
  );
}
