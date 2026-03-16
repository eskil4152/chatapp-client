import { Suspense } from "react";
import GetFriendsInfoClient from "@/src/app/friends/info/GetFriendsInfoClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <GetFriendsInfoClient />
    </Suspense>
  );
}
