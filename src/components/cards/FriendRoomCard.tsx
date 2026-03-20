import { useRouter } from "next/navigation";
import styles from "@/src/style/modules/Rooms.module.css";

export default function FriendRoomCard(room: RoomType) {
  const router = useRouter();

  return (
    <div key={room.roomId} className={styles.roomRow}>
      <button
        className={styles.roomCard}
        onClick={() => router.replace(`/chat?id=${room.roomId}`)}
      >
        <div className={styles.roomCardLeft}>
          <div className={styles.roomName}>{room.roomName}</div>
        </div>
      </button>
    </div>
  );
}
