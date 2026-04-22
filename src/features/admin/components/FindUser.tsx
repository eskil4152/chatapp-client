"use client";

import { useState } from "react";
import {
  getUser,
  changeUserRole,
  banUser,
} from "@/src/features/admin/api/adminApi";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { SITE_ROLES, UserRole } from "@/src/shared/lib/userRole";
import { UserDetailDTO } from "@/src/features/admin/types";

export default function FindUser() {
  const { siteRole } = useAuth();
  const myRank = SITE_ROLES.indexOf((siteRole ?? "USER") as UserRole);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [user, setUser] = useState<UserDetailDTO | null>(null);
  const [banReason, setBanReason] = useState("");
  const [showBanForm, setShowBanForm] = useState(false);
  const [actionPending, setActionPending] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setFetchError(null);
    setUser(null);
    setShowBanForm(false);
    setActionError(null);
    try {
      const result = await getUser(query.trim());
      setUser(result);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "NOT_FOUND") {
        setFetchError("User not found.");
      } else {
        setFetchError("Failed to fetch user.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handlePromote() {
    if (!user) return;
    const idx = SITE_ROLES.indexOf(user.role);
    const newRole = SITE_ROLES[idx + 1];
    if (!newRole) return;
    setActionPending("promote");
    setActionError(null);
    try {
      await changeUserRole({ userId: user.id, role: newRole });
      setUser({ ...user, role: newRole });
    } catch {
      setActionError("Failed to promote user.");
    } finally {
      setActionPending(null);
    }
  }

  async function handleBan() {
    if (!user) return;
    setActionPending("ban");
    setActionError(null);
    try {
      await banUser({ userId: user.id, reason: banReason || undefined });
      setUser(null);
      setShowBanForm(false);
      setBanReason("");
      setFetchError("User has been banned.");
    } catch {
      setActionError("Failed to ban user.");
    } finally {
      setActionPending(null);
    }
  }

  const targetRank = user ? SITE_ROLES.indexOf(user.role as UserRole) : -1;
  const canModify = user !== null && myRank > targetRank;
  const canPromote = canModify && targetRank + 1 < SITE_ROLES.length;

  return (
    <div>
      <form onSubmit={handleSearch} className="formStack">
        <input
          className="input"
          placeholder="Username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="primaryButton" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {fetchError && <p className="errorBox">{fetchError}</p>}

      {user && (
        <div className="card" style={{ marginTop: "24px" }}>
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt=""
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: 12,
                display: "block",
              }}
            />
          )}
          <div className="siteInfoRow">
            <span className="itemMeta">Username</span>
            <span className="itemName">{user.username}</span>
          </div>
          <div className="siteInfoRow">
            <span className="itemMeta">Role</span>
            <span className="adminRoleBadge">{user.role}</span>
          </div>
          {user.email && (
            <div className="siteInfoRow">
              <span className="itemMeta">Email</span>
              <span>{user.email}</span>
            </div>
          )}
          {user.fullName && (
            <div className="siteInfoRow">
              <span className="itemMeta">Name</span>
              <span>{user.fullName}</span>
            </div>
          )}
          {user.bio && (
            <div className="siteInfoRow">
              <span className="itemMeta">Bio</span>
              <span>{user.bio}</span>
            </div>
          )}
          <div className="siteInfoRow">
            <span className="itemMeta">Joined</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          {user.rooms && user.rooms.length > 0 && (
            <div className="siteInfoRow">
              <span className="itemMeta">Rooms</span>
              <span>{user.rooms.length}</span>
            </div>
          )}

          {actionError && (
            <p className="errorBox" style={{ marginTop: 12 }}>
              {actionError}
            </p>
          )}

          {canModify && (
            <div className="adminActions" style={{ marginTop: "16px" }}>
              {canPromote && (
                <button
                  className="secondaryButton"
                  disabled={actionPending === "promote"}
                  onClick={handlePromote}
                >
                  Promote
                </button>
              )}
              <button
                className="dangerButton"
                onClick={() => setShowBanForm((v) => !v)}
              >
                Ban
              </button>
            </div>
          )}

          {showBanForm && (
            <div className="formStack" style={{ marginTop: "12px" }}>
              <input
                className="input"
                placeholder="Reason (optional)"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
              <button
                className="dangerButton"
                disabled={actionPending === "ban"}
                onClick={handleBan}
              >
                Confirm Ban
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
