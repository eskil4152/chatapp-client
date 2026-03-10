import { Suspense } from "react";
import GetFriendsInfoPage from "@/src/app/friends/info/GetFriendsInfoPage";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <GetFriendsInfoPage />
    </Suspense>
  );
}
