import { Suspense } from "react";
import EditRoomPageClient from "./EditRoomPageClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="pageShellNarrow">
          <div className="card">
            <p className="loadingText">Loading...</p>
          </div>
        </div>
      }
    >
      <EditRoomPageClient />
    </Suspense>
  );
}
