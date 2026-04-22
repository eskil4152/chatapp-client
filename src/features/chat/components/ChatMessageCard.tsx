import { WsChat } from "@/src/shared/types/ws";
import styles from "@/src/style/modules/Chat.module.css";
import formatTimestamp from "@/src/shared/lib/formatTimestamp";

type Props = WsChat & {
  currentUserId?: string;
};

export default function ChatMessageCard(m: Props) {
  const isMine = m.currentUserId !== undefined && m.userId === m.currentUserId;

  return (
    <div className={`${styles.message} ${isMine ? styles.myOwn : ""}`}>
      <div className={styles.messageTopRow}>
        <div className={styles.sender}>{m.username}</div>
        <div className={styles.timestamp}>{formatTimestamp(m.timestamp)}</div>
      </div>

      <div className={styles.content}>{m.content}</div>
    </div>
  );
}
