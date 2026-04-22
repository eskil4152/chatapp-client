"use client";

import Link from "next/link";
import login from "@/src/features/auth/api/login";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "@/src/features/chat/components/LoadingOverlay";

export default function Page() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = await login(username, password);

    if (data.status === 200) {
      router.replace("/rooms");
    } else if (data.status === 401) {
      setError("Credentials not found.");
    } else {
      setError("An error occurred");
    }
    setLoading(false);
  }

  return (
    <div className="pageShellNarrow">
      <LoadingOverlay visible={loading} />
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

          <button
            type="submit"
            disabled={loading}
            className={`primaryButton ${loading ? "buttonLoading" : ""}`}
          >
            {loading ? "Logging in…" : "Log In"}
          </button>

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
