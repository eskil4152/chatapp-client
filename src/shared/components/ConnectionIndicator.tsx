"use client";

import { useAppSocket } from "@/src/shared/providers/AppSocketProvider";

export default function ConnectionIndicator() {
  const { connected, error } = useAppSocket();

  return (
    <div
      style={{
        background: connected ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.45)",
        color: connected ? "#a8f0b8" : "#ffd2d2",
        textAlign: "center",
        padding: "6px 12px",
        fontSize: "0.85rem",
      }}
    >
      {connected ? "Connected" : error || "Connecting..."}
    </div>
  );
}
