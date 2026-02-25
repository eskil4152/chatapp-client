import { Suspense } from "react";
import ChatClient from "./ChatClient";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="text-center">Loading…</div>}>
      <ChatClient />
    </Suspense>
  );
}
