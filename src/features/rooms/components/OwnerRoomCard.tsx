import { useRouter } from "next/navigation";
import styles from "@/src/style/modules/Rooms.module.css";
import { RoomType } from "@/src/features/rooms/types";

export function OwnerRoomCard({ roomId, roomName, encrypted }: RoomType) {
  const router = useRouter();

  return (
    <div className="itemRow">
      <button
        className="interactiveCard"
        onClick={() => router.replace(`/chat?id=${roomId}`)}
      >
        <div className={styles.roomCardLeft}>
          <div className="itemName">{roomName}</div>
        </div>

        <div className={styles.roomCardRight}>
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
          router.push(`/rooms/edit?id=${roomId}`);
        }}
      >
        Edit room
      </button>
    </div>
  );
}
