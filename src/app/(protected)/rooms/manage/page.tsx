import { Suspense } from "react";
import ManageRoomClient from "@/src/features/rooms/components/ManageRoomClient";

export default function Page() {
  return (
    <Suspense fallback={<p className="loadingText">Loading...</p>}>
      <ManageRoomClient />
    </Suspense>
  );
}
