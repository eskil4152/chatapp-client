import { SiteRole } from "@/src/shared/lib/siteRole";

export type ElevatedUserDTO = {
  userId: string;
  username: string;
  role: SiteRole;
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
  role: SiteRole;
  createdAt: string;
  rooms?: JoinedRoomDTO[];
};

export type BannedUserDTO = {
  userId: string;
  username: string;
  bannedBy: string;
  bannedByUsername: string;
  bannedByRole: SiteRole;
  bannedAt: string;
  reason?: string;
};

export type UserRoleDTO = {
  userId: string;
  role: SiteRole;
};

export type BanUserDTO = {
  userId: string;
  reason?: string;
};

export type UserIdDTO = {
  userId: string;
};
