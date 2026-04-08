"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import editRoom from "@/src/features/rooms/api/editRoom";
import deleteRoom from "@/src/features/rooms/api/deleteRoom";
import getRoomMembers from "@/src/features/rooms/api/getRoomMembers";
import getBanList from "@/src/features/rooms/api/getBanList";
import roomAction from "@/src/features/rooms/api/roomAction";
import unbanUser from "@/src/features/rooms/api/unbanUser";
import changeRole from "@/src/features/rooms/api/changeRole";
import getOutgoingInvites from "@/src/features/invites/api/getOutgoingInvites";
import createOpenInvite from "@/src/features/invites/api/createOpenInvite";
import sendRoomInvite from "@/src/features/invites/api/sendRoomInvite";
import ConfirmPopup from "@/src/shared/components/ConfirmPopup";
import { OutgoingOpenRoomInvite } from "@/src/features/invites/types";

type Member = {
  id: string;
  username: string;
  avatarUrl: string | null;
  role: string;
};

type BannedUser = {
  id: string;
  username: string;
  avatarUrl: string | null;
};

type PendingAction = {
  userId: string;
  username: string;
  action: "KICK" | "BAN";
};

type PendingRoleChange = {
  userId: string;
  username: string;
  currentRole: string;
  action: "PROMOTE" | "DEMOTE";
};

const ROLE_UP: Record<string, string> = { MEMBER: "MODERATOR", MODERATOR: "ADMIN" };
const ROLE_DOWN: Record<string, string> = { ADMIN: "MODERATOR", MODERATOR: "MEMBER" };

export default function ManageRoomClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id") ?? "";
  const role = searchParams.get("role") ?? "";

  const ROLE_ORDER: Record<string, number> = { MEMBER: 0, MODERATOR: 1, ADMIN: 2, OWNER: 3 };
  const isAtLeast = (required: string) => (ROLE_ORDER[role] ?? 0) >= (ROLE_ORDER[required] ?? 0);

  // Settings
  const [roomName, setRoomName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  // Members
  const [members, setMembers] = useState<Member[]>([]);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [pendingRoleChange, setPendingRoleChange] = useState<PendingRoleChange | null>(null);

  // Bans
  const [banned, setBanned] = useState<BannedUser[]>([]);

  // Invites
  const [openInvites, setOpenInvites] = useState<OutgoingOpenRoomInvite[]>([]);
  const [maxUsages, setMaxUsages] = useState("10");
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState("");
  const [inviteUserId, setInviteUserId] = useState("");
  const [inviteUserStatus, setInviteUserStatus] = useState("");

  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!roomId) return;

    async function load() {
      const [membersRes, bansRes, invitesRes] = await Promise.all([
        getRoomMembers(roomId),
        isAtLeast("ADMIN") ? getBanList(roomId) : Promise.resolve(null),
        isAtLeast("ADMIN") ? getOutgoingInvites() : Promise.resolve(null),
      ]);

      if (membersRes.status === 401 || bansRes?.status === 401 || invitesRes?.status === 401) {
        router.replace("/login");
        return;
      }
      if (membersRes.status === 403) {
        setLoadError("You are not permitted to manage this room.");
        return;
      }

      if (membersRes.status === 200) setMembers((membersRes.data as Member[]) ?? []);
      if (bansRes?.status === 200) setBanned((bansRes.data as BannedUser[]) ?? []);
      if (invitesRes?.status === 200) {
        const all = (invitesRes.data as OutgoingOpenRoomInvite[]) ?? [];
        setOpenInvites(all.filter((i) => i.type === "OPEN_ROOM_INVITE" && i.roomId === roomId));
      }
    }

    void load();
  }, [roomId, router]);

  async function handleRename(e: React.FormEvent) {
    e.preventDefault();
    const res = await editRoom(roomId, roomName);
    if (res.status === 200) {
      setSettingsError("");
      setRoomName("");
    } else if (res.status === 401) {
      router.replace("/login");
    } else if (res.status === 403) {
      setSettingsError("You cannot edit this room.");
    } else {
      setSettingsError("Invalid room name.");
    }
  }

  async function handleDelete() {
    const res = await deleteRoom(roomId);
    if (res.ok) {
      router.replace("/rooms");
    } else if (res.status === 401) {
      router.replace("/login");
    }
  }

  async function handleMemberAction() {
    if (!pendingAction) return;
    const res = await roomAction(roomId, pendingAction.userId, pendingAction.action);
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== pendingAction.userId));
      if (pendingAction.action === "BAN") {
        setBanned((prev) => [
          ...prev,
          { id: pendingAction.userId, username: pendingAction.username, avatarUrl: null },
        ]);
      }
    }
    setPendingAction(null);
  }

  async function handleUnban(userId: string) {
    const res = await unbanUser(roomId, userId);
    if (res.ok) setBanned((prev) => prev.filter((u) => u.id !== userId));
  }

  async function handleRoleChange() {
    if (!pendingRoleChange) return;
    const res = await changeRole(pendingRoleChange.userId, roomId, pendingRoleChange.action);
    if (res.ok) {
      const newRole = pendingRoleChange.action === "PROMOTE"
        ? ROLE_UP[pendingRoleChange.currentRole]
        : ROLE_DOWN[pendingRoleChange.currentRole];
      setMembers((prev) =>
        prev.map((m) => m.id === pendingRoleChange.userId ? { ...m, role: newRole } : m)
      );
    }
    setPendingRoleChange(null);
  }

  async function handleInviteUser(e: React.FormEvent) {
    e.preventDefault();
    setInviteUserStatus("");
    const res = await sendRoomInvite(inviteUserId.trim(), roomId);
    if (res.ok) {
      setInviteUserId("");
      setInviteUserStatus("Invite sent.");
    } else if (res.status === 401) {
      router.replace("/login");
    } else if (res.status === 404) {
      setInviteUserStatus("User not found.");
    } else if (res.status === 409) {
      setInviteUserStatus("User already in room or already invited.");
    } else if (res.status === 403) {
      setInviteUserStatus("You cannot invite users to this room.");
    } else {
      setInviteUserStatus("Failed to send invite.");
    }
  }

  async function handleGenerateInvite(e: React.FormEvent) {
    e.preventDefault();
    const usages = parseInt(maxUsages, 10);
    if (!usages || usages <= 0) {
      setInviteError("Enter a valid number of uses.");
      return;
    }

    const res = await createOpenInvite(roomId, usages);
    if (res.ok) {
      const id = (await res.text()).trim();
      setGeneratedId(id);
      setInviteError("");
      setOpenInvites((prev) => [
        ...prev,
        { id, type: "OPEN_ROOM_INVITE", fromUserId: "", roomId, usages: 0, maxUsages: usages, expiresAt: "" },
      ]);
    } else if (res.status === 401) {
      router.replace("/login");
    } else if (res.status === 403) {
      setInviteError("You cannot create invites for this room.");
    } else {
      setInviteError("Failed to generate invite.");
    }
  }

  if (loadError) {
    return (
      <div className="pageShellNarrow">
        <p className="errorBox">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="pageList">
      {pendingAction && (
        <ConfirmPopup
          message={`${pendingAction.action === "BAN" ? "Ban" : "Kick"} ${pendingAction.username} from this room?`}
          confirmLabel={pendingAction.action === "BAN" ? "Yes, ban" : "Yes, kick"}
          onConfirm={handleMemberAction}
          onCancel={() => setPendingAction(null)}
        />
      )}

      {pendingRoleChange && (
        <ConfirmPopup
          message={`${pendingRoleChange.action === "PROMOTE" ? "Promote" : "Demote"} ${pendingRoleChange.username} to ${pendingRoleChange.action === "PROMOTE" ? ROLE_UP[pendingRoleChange.currentRole] : ROLE_DOWN[pendingRoleChange.currentRole]}?`}
          confirmLabel={pendingRoleChange.action === "PROMOTE" ? "Promote" : "Demote"}
          onConfirm={handleRoleChange}
          onCancel={() => setPendingRoleChange(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmPopup
          message="Delete this room? This cannot be undone."
          confirmLabel="Yes, delete"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {/* Settings — ADMIN+ for rename, OWNER for delete */}
      {isAtLeast("ADMIN") && (
        <>
          <h2 className="sectionTitle">Settings</h2>
          <div className="card">
            <form onSubmit={handleRename} className="formStack">
              <input
                type="text"
                placeholder="New room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <button className="primaryButton" disabled={roomName.trim().length === 0}>
                Rename
              </button>
            </form>

            {settingsError && <p className="errorBox">{settingsError}</p>}

            {isAtLeast("OWNER") && (
              <>
                <hr className="divider" />
                <button
                  type="button"
                  className="dangerButton"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete room
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Invite user — MODERATOR+ */}
      {isAtLeast("MODERATOR") && (
        <>
          <h2 className="sectionTitle">Invite user</h2>
          <div className="card">
            <form onSubmit={handleInviteUser} className="formStack">
              <input
                type="text"
                placeholder="Username"
                value={inviteUserId}
                onChange={(e) => setInviteUserId(e.target.value)}
              />
              <button className="primaryButton" disabled={inviteUserId.trim().length === 0}>
                Send invite
              </button>
            </form>
            {inviteUserStatus && <p className="statusBox">{inviteUserStatus}</p>}
          </div>
        </>
      )}

      {/* Open invites — ADMIN+ */}
      {isAtLeast("ADMIN") && (
        <>
          <h2 className="sectionTitle">Open invites</h2>
          <div className="card">
            <form onSubmit={handleGenerateInvite} className="formStack">
              <input
                type="number"
                placeholder="Max uses"
                min={1}
                value={maxUsages}
                onChange={(e) => setMaxUsages(e.target.value)}
              />
              <button className="primaryButton">Generate invite</button>
            </form>

            {inviteError && <p className="errorBox">{inviteError}</p>}

            {generatedId && (
              <p className="statusBox">
                Invite created: <strong style={{ userSelect: "all" }}>{generatedId}</strong>
              </p>
            )}
          </div>

          {openInvites.length > 0 && (
            <div className="itemList">
              {openInvites.map((invite) => (
                <div key={invite.id} className="card">
                  <div className="itemMeta" style={{ userSelect: "all", wordBreak: "break-all" }}>
                    {invite.id}
                  </div>
                  <div className="itemMeta">
                    {invite.usages} / {invite.maxUsages} uses
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Members — MODERATOR+ */}
      {isAtLeast("MODERATOR") && (
        <>
          <h2 className="sectionTitle">Members</h2>
          {members.length === 0 ? (
            <p className="empty">No members</p>
          ) : (
            <div className="itemList">
              {members.map((member) => (
                <div key={member.id} className="itemRow">
                  <div className="interactiveCard">
                    <div className="cardPrimary">
                      <div className="itemName">{member.username}</div>
                    </div>
                    <div className="cardSecondary">
                      <span className="itemMeta">{member.role}</span>
                    </div>
                  </div>
                  {isAtLeast("MODERATOR") && member.role !== "OWNER" && (
                    <button
                      className="actionButton"
                      onClick={() => setPendingAction({ userId: member.id, username: member.username, action: "KICK" })}
                    >
                      Kick
                    </button>
                  )}
                  {isAtLeast("ADMIN") && member.role !== "OWNER" && (
                    <button
                      className="actionButton"
                      onClick={() => setPendingAction({ userId: member.id, username: member.username, action: "BAN" })}
                    >
                      Ban
                    </button>
                  )}
                  {isAtLeast("ADMIN") && ROLE_UP[member.role] && (member.role !== "MODERATOR" || isAtLeast("OWNER")) && (
                    <button
                      className="actionButton"
                      onClick={() => setPendingRoleChange({ userId: member.id, username: member.username, currentRole: member.role, action: "PROMOTE" })}
                    >
                      Promote
                    </button>
                  )}
                  {isAtLeast("ADMIN") && ROLE_DOWN[member.role] && (member.role !== "ADMIN" || isAtLeast("OWNER")) && (
                    <button
                      className="actionButton"
                      onClick={() => setPendingRoleChange({ userId: member.id, username: member.username, currentRole: member.role, action: "DEMOTE" })}
                    >
                      Demote
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Bans — ADMIN+ */}
      {isAtLeast("ADMIN") && banned.length > 0 && (
        <>
          <h2 className="sectionTitle">Banned</h2>
          <div className="itemList">
            {banned.map((user) => (
              <div key={user.id} className="itemRow">
                <div className="interactiveCard">
                  <div className="cardPrimary">
                    <div className="itemName">{user.username}</div>
                  </div>
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
        </>
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
