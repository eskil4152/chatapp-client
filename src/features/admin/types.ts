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

export type SiteInfoDTO = {
  connectedUsers: number;
  totalSessions: number;
  activeRooms: number;
  totalUsers: number;
  totalRooms: number;
  bannedUsers: number;
};

export type HttpStatusCount = {
  status: number;
  count: number;
};

export type HttpEndpointMetric = {
  uri: string;
  method: string;
  statuses: HttpStatusCount[];
  meanMs: number;
  maxMs: number;
};

export type AdvancedSiteInfoDTO = {
  jvmMemoryUsedMb: number;
  jvmMemoryMaxMb: number;
  jvmMemoryCommittedMb: number;
  jvmThreadsLive: number;
  jvmThreadsPeak: number;
  cpuUsagePercent: number;
  gcPauseMeanMs: number;
  gcPauseMaxMs: number;
  uptimeSeconds: number;
  httpRequests: HttpEndpointMetric[];
};

export type BanUserDTO = {
  userId: string;
  reason?: string;
};

export type UserIdDTO = {
  userId: string;
};
