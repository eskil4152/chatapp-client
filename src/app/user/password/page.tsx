"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="primaryButton">Change Password</button>
        </form>

        {error && <p className="errorBox">{error}</p>}
      </div>
    </div>
  );
}
