import { UserRole } from "@/src/shared/lib/userRole";

export type ElevatedUserDTO = {
  userId: string;
  username: string;
  role: UserRole;
};

export type JoinedRoomDTO = {
  id: string;
  name: string;
};

export type UserDetailDTO = {
  id: string;
  username: string;
  bio?: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  rooms?: JoinedRoomDTO[];
};

export type BannedUserDTO = {
  userId: string;
  username: string;
  bannedBy: string;
  bannedByUsername: string;
  bannedByRole: UserRole;
  bannedAt: string;
  reason?: string;
};

export type UserRoleDTO = {
  id: string;
  action: UserRoleAction;
};

export const USER_ROLE_ACTIONS = ["PROMOTE", "DEMOTE"] as const;
export type UserRoleAction = (typeof USER_ROLE_ACTIONS)[number];

export type BanUserDTO = {
  userId: string;
  reason?: string;
};

export type UserIdDTO = {
  userId: string;
};
