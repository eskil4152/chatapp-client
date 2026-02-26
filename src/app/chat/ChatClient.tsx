"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ChatClient() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_API_URL}/ws`);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "JOIN",
          roomId: roomId,
        }),
      );
    };

    ws.onmessage = (event) => {
      const { username, content } = JSON.parse(event.data);

      console.log(JSON.parse(event.data));

      const new_message = `${username}: ${content}`;
      setMessages((messages) => [...messages, new_message]);
    };

    wsRef.current = ws;

    return () => {
      if (wsRef.current && wsRef.current.readyState == WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "LEAVE",
            roomId: roomId,
          }),
        );
        ws.close();
      }
    };
  }, [roomId]);

  return (
    <div className="text-center">
      <h2>Room {roomId}</h2>
      <hr />
      <div>
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
      <hr />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!message || !wsRef.current) return;

          wsRef.current.send(
            JSON.stringify({
              type: "MESSAGE",
              roomId: roomId,
              message: message,
            }),
          );

          setMessage("");
        }}
      >
        <input
          type="text"
          id="message"
          width={10}
          height={5}
          placeholder="Enter message"
          className="border-2 border-black my-2 p-[3px] dark:text-black"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <br />

        <div className="flex justify-center gap-10">
          <button className="border-2 border-black px-4 rounded-full mt-2 dark:border-white">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
