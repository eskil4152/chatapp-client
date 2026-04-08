export type InviteType = "FRIEND_REQUEST" | "ROOM_INVITE" | "OPEN_ROOM_INVITE";

export type PendingInvite = {
  id: string;
  type: InviteType;
  fromUserId: string;
  fromUsername: string;
  fromAvatarUrl: string | null;
  roomId: string | null;
  roomName: string | null;
  expiresAt: string;
};

export type OutgoingFriendRequest = {
  id: string;
  type: "FRIEND_REQUEST";
  toUserId: string;
  toUsername: string;
  avatar: string | null;
  expiresAt: string;
};

export type OutgoingRoomInvite = {
  id: string;
  type: "ROOM_INVITE";
  toUserId: string;
  toUsername: string;
  avatar: string | null;
  roomId: string;
  roomName: string | null;
  expiresAt: string;
};

export type OutgoingOpenRoomInvite = {
  id: string;
  type: "OPEN_ROOM_INVITE";
  roomId: string;
  usages: number;
  maxUsages: number;
  expiresAt: string;
};

export type OutgoingInvite =
  | OutgoingFriendRequest
  | OutgoingRoomInvite
  | OutgoingOpenRoomInvite;
