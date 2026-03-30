export type RoomType = {
  roomId: string;
  roomName: string;
  encrypted: boolean;
  role: string;
  type: string;
  onLeave?: (roomId: string) => void;
};
