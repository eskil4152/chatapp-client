import { Suspense } from "react";
import FriendInfoClient from "@/src/features/friends/components/FriendInfoClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <FriendInfoClient />
    </Suspense>
  );
}
