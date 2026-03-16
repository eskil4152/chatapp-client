import styles from "@/src/style/modules/Rooms.module.css";
import LeaveRoomAPI from "@/src/api/rooms/LeaveRoomAPI";
import { useRouter } from "next/navigation";

export default function RoomCard({
  roomId,
  roomName,
  encrypted,
  onLeave,
}: RoomType) {
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
        onClick={async (e) => {
          e.stopPropagation();
          const res = await LeaveRoomAPI(roomId);

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
