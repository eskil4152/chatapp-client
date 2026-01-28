"use client";

import Link from "next/link";
import LogInAPI from "@/src/api/LoginAPI";
import React, { useState } from "react";
import { redirect } from "next/navigation";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await LogInAPI(username, password);

    if (data.status === 200) {
      //setError("");
      //window.location.href = "/account";
      redirect("/");
    } else if (data.status === 401) {
      setError("Wrong Password");
    } else {
      setError("An error occurred");
    }
  }

  return (
    <div className="text-center">
      <h1 className="text-xl font-semibold mt-2">Log In</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="username"
          width={10}
          height={5}
          placeholder="Username / Email"
          className="border-2 border-black my-2 p-[3px] dark:text-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br />

        <input
          type={passwordVisible ? "text" : "password"}
          id="password"
          width={10}
          height={5}
          placeholder="Password"
          className="border-2 border-black my-2 p-[3px] dark:text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        <div className="flex justify-center gap-10">
          <button className="border-2 border-black px-4 rounded-full mt-2 dark:border-white">
            Log In
          </button>
        </div>
      </form>

      <Link
        className="text-center border-2 border-black px-4 rounded-full mt-2 dark:border-white"
        href={{
          pathname: "/register",
        }}
      >
        <p>Register</p>
      </Link>

      <br />

      <button
        className="border-2 border-black px-4 mt-2 rounded-full dark:border-white"
        onClick={togglePasswordVisibility}
      >
        {passwordVisible ? "Hide Password" : "Show Password"}
      </button>

      <p className="text-red-600 font-bold text-lg">{error}</p>
    </div>
  );
}
