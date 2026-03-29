import { useRouter } from "next/navigation";
import styles from "@/src/style/modules/Rooms.module.css";
import { RoomType } from "@/src/features/rooms/types";

export default function FriendRoomCard(room: RoomType) {
  const router = useRouter();

  return (
    <div className="itemRow">
      <button
        className="interactiveCard"
        onClick={() => router.replace(`/chat?id=${room.roomId}`)}
      >
        <div className={styles.roomCardLeft}>
          <div className="itemName">{room.roomName}</div>
        </div>
      </button>
    </div>
  );
}
