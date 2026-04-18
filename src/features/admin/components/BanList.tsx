"use client";

import { useState } from "react";
import useLoading from "@/src/shared/hooks/useLoading";
import { getBannedUsers, unbanUser } from "@/src/features/admin/api/adminApi";
import { BannedUserDTO } from "@/src/features/admin/types";

const PAGE_SIZES = [25, 50, 100] as const;

export default function BanList() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState<25 | 50 | 100>(25);
  const [pending, setPending] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { loading, error, response: bans, reload } = useLoading(
    () => getBannedUsers(page, size),
    [page, size],
  );

  async function handleUnban(userId: string) {
    setPending(userId);
    setActionError(null);
    try {
      await unbanUser({ userId });
      await reload();
    } catch {
      setActionError("Failed to unban user.");
    } finally {
      setPending(null);
    }
  }

  if (loading) return <p className="loadingText">Loading…</p>;
  if (error) return <p className="loadingText">Failed to load ban list.</p>;

  const list = bans ?? [];

  return (
    <div>
      <div className="adminPaginationBar">
        <div className="adminSizeSelector">
          {PAGE_SIZES.map((s) => (
            <button
              key={s}
              className={`actionButton${size === s ? " activeToggle" : ""}`}
              onClick={() => { setSize(s); setPage(0); }}
            >{s}</button>
          ))}
        </div>
        <div className="adminPageControls">
          <button
            className="actionButton"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >←</button>
          <span className="itemMeta">Page {page + 1}</span>
          <button
            className="actionButton"
            onClick={() => setPage((p) => p + 1)}
            disabled={list.length < size}
          >→</button>
        </div>
      </div>

      {actionError && <p className="errorBox">{actionError}</p>}

      {list.length === 0 ? (
        <p className="empty">No banned users.</p>
      ) : (
        <div className="itemList">
          {list.map((ban: BannedUserDTO) => (
            <div key={ban.userId} className="adminUserRow">
              <div>
                <span className="itemName">{ban.username}</span>
                <div className="adminBanMeta">
                  <span className="itemMeta">
                    Banned by {ban.bannedByUsername} ({ban.bannedByRole}) · {new Date(ban.bannedAt).toLocaleDateString()}
                  </span>
                  {ban.reason && <span className="itemMeta">Reason: {ban.reason}</span>}
                </div>
              </div>
              <button
                className="secondaryButton"
                disabled={pending === ban.userId}
                onClick={() => handleUnban(ban.userId)}
              >Unban</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
