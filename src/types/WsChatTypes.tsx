export type WsJoined = {
  type: "JOINED";
  roomId: string;
  roomName: string;
  encrypted: boolean;
};

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

export type WsInbound = WsJoined | WsError | WsChat;

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
