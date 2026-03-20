import { useRouter } from "next/navigation";
import styles from "@/src/style/modules/Rooms.module.css";

export function OwnerRoomCard({ roomId, roomName, encrypted }: RoomType) {
  const router = useRouter();

  return (
    <div className={styles.roomRow}>
      <button
        className={styles.roomCard}
        onClick={() => router.replace(`/chat?id=${roomId}`)}
      >
        <div className={styles.roomCardLeft}>
          <div className={styles.roomName}>{roomName}</div>
        </div>

        <div className={styles.roomCardRight}>
          <span className={styles.roomMeta}>
            {encrypted ? "Encrypted" : "Not encrypted"}
          </span>
        </div>
      </button>

      <button
        type="button"
        className={styles.optionsButton}
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
