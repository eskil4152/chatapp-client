import { useRouter } from "next/navigation";
import { RoomType } from "@/src/features/rooms/types";

export function OwnerRoomCard({ roomId, roomName, encrypted, role }: RoomType) {
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
          <span className="itemMeta">{role}</span>
          <span className="itemMeta">
            {encrypted ? "Encrypted" : "Not encrypted"}
          </span>
        </div>
      </button>

      <button
        type="button"
        className="actionButton"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/rooms/manage?id=${roomId}&role=${role}`);
        }}
      >
        Manage
      </button>
    </div>
  );
}
