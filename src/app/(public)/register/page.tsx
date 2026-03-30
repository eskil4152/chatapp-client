"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import register from "@/src/features/auth/api/register";

export default function Page() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await register(username, password);

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
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`input ${
              username.length > 0 && username.length < 3 ? "inputError" : ""
            }`}
          />
          {username.length > 0 && username.length < 3 && (
            <div className="inputHint">Minimum 3 characters</div>
          )}

          <div className="inputGroup">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input ${
                password.length > 0 && password.length < 8 ? "inputError" : ""
              }`}
            />

            {password.length > 0 && password.length < 8 && (
              <div className="inputHint">Minimum 8 characters</div>
            )}
          </div>

          <button
            type="submit"
            disabled={password.length < 8 || username.length < 3}
            className={`primaryButton ${password.length < 8 || username.length < 3 ? "buttonDisabled" : ""}`}
          >
            Submit
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

        <Link className="secondaryButton" href="/login">
          Back to Login
        </Link>

        {error && <p className="errorBox">{error}</p>}
      </div>
    </div>
  );
}
