"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import changePassword from "@/src/features/user/api/changePassword";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [old, setOld] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await changePassword(old, password);

    if (data.ok) {
      router.push("/user");
    } else if (data.status === 401) {
      router.replace("/login");
    } else {
      const err = await data.json();
      setError(err.message);
    }
  }

  return (
    <div className="pageShellNarrow">
      <div className="card">
        <h1 className="pageTitle">Change Password</h1>

        <form onSubmit={handleSubmit} className="formStack">
          <input
            type="password"
            placeholder="Old password"
            value={old}
            onChange={(e) => setOld(e.target.value)}
          />

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
            disabled={password.length < 8}
            className={`primaryButton ${password.length < 8 ? "buttonDisabled" : ""}`}
          >
            Submit
          </button>
        </form>

        <button
          type="button"
          className="textButton"
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          {passwordVisible ? "Hide Password" : "Show Password"}
        </button>

        {error && <p className="errorBox">{error}</p>}
      </div>
    </div>
  );
}
