import { InviteType } from "@/src/features/invites/types";

export type WsError = {
  type: "ERROR";
  code: number;
  message: string;
};

export type WsChat = {
  type: "MESSAGE" | "JOIN" | "LEAVE";
  userId: string;
  username: string;
  content: string;
  timestamp: string;
};

export type RoomUser = {
  id: string;
  username: string;
  avatar: string | null;
  online: boolean;
};

export type WsRoomJoined = {
  type: "ROOM_JOINED";
  roomId: string;
  roomName: string;
  encrypted: boolean;
  role: string;
  members: RoomUser[];
};

export type WsRoomAction = {
  type: "ROOM_ACTION";
  roomId: string;
  action: "KICK" | "BAN";
  reason: string;
};

export type WsRoomPresence = {
  type: "ROOM_PRESENCE";
  roomId: string;
  userId: string;
  online: boolean;
};

export type WsFriendPresence = {
  type: "FRIEND_PRESENCE";
  userId: string;
  online: boolean;
};

export type OnlineFriend = {
  userId: string;
  username: string;
  avatarUrl: string | null;
  online: boolean;
};

export type WsFriendSnapshot = {
  type: "FRIEND_SNAPSHOT";
  friends: OnlineFriend[];
};

export type WsFriendRemoved = {
  type: "FRIEND_REMOVED";
  userId: string;
};

export type WsFriendAdded = {
  type: "FRIEND_ADDED";
  userId: string;
  username: string;
  avatarUrl: string | null;
  online: boolean;
};

export type WsRoomDeleted = {
  type: "ROOM_DELETED";
  roomId: string;
  roomName: string;
};

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

export type WsPendingInvitesSnapshot = {
  type: "PENDING_INVITES";
  invites: PendingInvite[];
};

export type WsInviteReceived = {
  type: "INVITE_RECEIVED";
  id: string;
  inviteType: InviteType;
  fromUsername: string;
  roomName: string | null;
  fromAvatarUrl: string | null;
};

export type WsInviteAccepted = {
  type: "INVITE_ACCEPTED";
  inviteType: InviteType;
  roomId: string | null;
  username: string;
  avatarUrl: string | null;
};

export type WsTyping = {
  type: "TYPING";
  username: string;
  userId: string;
  roomId: string;
};

export type WsMessageNotification = {
  type: "MESSAGE_NOTIFICATION";
  roomId: string;
  roomName: string;
  userId: string;
  username: string;
  preview: string;
};

export type WsInbound =
  | WsError
  | WsChat
  | WsRoomJoined
  | WsRoomPresence
  | WsRoomAction
  | WsRoomDeleted
  | WsFriendSnapshot
  | WsFriendPresence
  | WsFriendAdded
  | WsFriendRemoved
  | WsPendingInvitesSnapshot
  | WsInviteReceived
  | WsInviteAccepted
  | WsTyping
  | WsMessageNotification;

export type HistoryMessage = {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  message: string | null;
  nonce: string | null;
  ciphertext: string | null;
  timestamp: string;
  keyVersion: number | null;
};
