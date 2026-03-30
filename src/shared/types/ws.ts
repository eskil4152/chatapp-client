export type WsError = {
  type: "ERROR";
  code: number;
  message: string;
};

export type WsChat = {
  type: "MESSAGE" | "JOIN" | "LEAVE";
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

export type WsInbound =
  | WsError
  | WsChat
  | WsRoomJoined
  | WsRoomPresence
  | WsRoomAction
  | WsFriendPresence;

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
