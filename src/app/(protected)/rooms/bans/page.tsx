"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import getBanList from "@/src/features/rooms/api/getBanList";
import unbanUser from "@/src/features/rooms/api/unbanUser";

type BannedUser = {
  id: string;
  username: string;
  avatarUrl: string | null;
};

export default function BanList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id") ?? "";

  const [banned, setBanned] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!roomId) return;
    getBanList(roomId).then(({ status, data }) => {
      if (status === 401) {
        router.replace("/login");
        return;
      }

      if (status === 403) {
        setError("You are not authorized to view this page.");
        setLoading(false);
        return;
      }

      if (status === 200) setBanned((data as BannedUser[]) ?? []);
      else if (status === 404) setError("Room not found");
      else setError("Failed to load ban list");

      setLoading(false);
    });
  }, [roomId, router]);

  async function handleUnban(id: string) {
    const res = await unbanUser(roomId, id);
    if (res.ok) setBanned((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="pageList">
      <h2 className="sectionTitle">Ban list</h2>

      {loading && <p className="empty">Loading...</p>}
      {!loading && !!error && <p className="errorBox">{error}</p>}
      {!loading && !error && banned.length === 0 && (
        <p className="empty">No banned users</p>
      )}

      {banned.length > 0 && (
        <div className="itemList">
          {banned.map((user) => (
            <div key={user.id} className="itemRow">
              <div className="cardPrimary">
                <div className="itemName">{user.username}</div>
              </div>
              <button
                className="actionButton"
                onClick={() => void handleUnban(user.id)}
              >
                Unban
              </button>
            </div>
          ))}
        </div>
      )}

      <hr className="divider" />

      <div className="pageActions">
        <button className="secondaryButton" onClick={() => router.back()}>
          Back
        </button>
      </div>
    </div>
  );
}
