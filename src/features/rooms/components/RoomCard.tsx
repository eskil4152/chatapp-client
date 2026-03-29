import leaveRoom from "@/src/features/rooms/api/leaveRoom";
import { useRouter } from "next/navigation";
import { RoomType } from "@/src/features/rooms/types";

export default function RoomCard({
  roomId,
  roomName,
  encrypted,
  onLeave,
}: RoomType) {
  const router = useRouter();

  return (
    <div className="itemRow">
      <button
        className="interactiveCard"
        onClick={() => router.replace(`/chat?id=${roomId}`)}
      >
        <div className="cardPrimary">
          <div className="itemName">{roomName}</div>
        </div>

        <div className="cardSecondary">
          <span className="itemMeta">
            {encrypted ? "Encrypted" : "Not encrypted"}
          </span>
        </div>
      </button>

      <button
        type="button"
        className="actionButton"
        onClick={async (e) => {
          e.stopPropagation();
          const res = await leaveRoom(roomId);

          if (res.ok) {
            onLeave?.(roomId);
          } else if (res.status === 401) {
            router.replace("/login");
          }
        }}
      >
        Leave
      </button>
    </div>
  );
}
