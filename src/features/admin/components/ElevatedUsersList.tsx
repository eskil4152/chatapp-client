"use client";

import { useState } from "react";
import useLoading from "@/src/shared/hooks/useLoading";
import {
  getElevatedUsers,
  changeUserRole,
} from "@/src/features/admin/api/adminApi";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { SITE_ROLES, UserRole } from "@/src/shared/lib/userRole";
import { ElevatedUserDTO } from "@/src/features/admin/types";

const PAGE_SIZES = [25, 50, 100] as const;

export default function ElevatedUsersList() {
  const { user } = useAuth();
  const myRank = SITE_ROLES.indexOf((user?.userRole ?? "USER") as UserRole);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState<25 | 50 | 100>(25);
  const [pending, setPending] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    loading,
    error,
    response: users,
    reload,
  } = useLoading(getElevatedUsers);

  const allUsers = users ?? [];
  const pageCount = Math.ceil(allUsers.length / size);
  const visible = allUsers.slice(page * size, page * size + size);

  async function handleRoleChange(
    user: ElevatedUserDTO,
    direction: "up" | "down",
  ) {
    const idx = SITE_ROLES.indexOf(user.role);
    const newRole =
      direction === "up" ? SITE_ROLES[idx + 1] : SITE_ROLES[idx - 1];
    if (!newRole) return;
    setPending(user.userId + direction);
    setActionError(null);
    try {
      await changeUserRole({ id: user.userId, action: direction === "up" ? "PROMOTE" : "DEMOTE" });
      await reload();
    } catch {
      setActionError("Failed to update role.");
    } finally {
      setPending(null);
    }
  }

  if (loading) return <p className="loadingText">Loading…</p>;
  if (error) return <p className="loadingText">Failed to load users.</p>;

  return (
    <div>
      <div className="adminPaginationBar">
        <div className="adminSizeSelector">
          {PAGE_SIZES.map((s) => (
            <button
              key={s}
              className={`actionButton${size === s ? " activeToggle" : ""}`}
              onClick={() => {
                setSize(s);
                setPage(0);
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="adminPageControls">
          <button
            className="actionButton"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            ←
          </button>
          <span className="itemMeta">
            {page + 1} / {Math.max(1, pageCount)}
          </span>
          <button
            className="actionButton"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
          >
            →
          </button>
        </div>
      </div>

      {actionError && <p className="errorBox">{actionError}</p>}

      {visible.length === 0 ? (
        <p className="empty">No elevated users found.</p>
      ) : (
        <div className="itemList">
          {visible.map((user) => {
            const targetRank = SITE_ROLES.indexOf(user.role);
            const canModify = myRank > targetRank;
            const canPromote = canModify && targetRank + 1 < SITE_ROLES.length;
            const canDemote = canModify && targetRank > 0;
            return (
              <div key={user.userId} className="adminUserRow">
                <div>
                  <span className="itemName">{user.username}</span>
                  <span className="adminRoleBadge">{user.role}</span>
                </div>
                {canModify && (
                  <div className="adminActions">
                    {canPromote && (
                      <button
                        className="secondaryButton"
                        disabled={pending === user.userId + "up"}
                        onClick={() => handleRoleChange(user, "up")}
                      >
                        Promote
                      </button>
                    )}
                    {canDemote && (
                      <button
                        className="dangerButton"
                        disabled={pending === user.userId + "down"}
                        onClick={() => handleRoleChange(user, "down")}
                      >
                        Demote
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
