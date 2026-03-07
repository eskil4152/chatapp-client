"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterAPI from "@/src/api/RegisterAPI";

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
    <div className="pageShellNarrow">
      <div className="card">
        <h1 className="pageTitle">Register</h1>

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

          <button className="primaryButton">Register</button>

          <button
            type="button"
            className="textButton"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? "Hide Password" : "Show Password"}
          </button>
        </form>

        {error && <p className="errorBox">{error}</p>}
      </div>
    </div>
  );
}
