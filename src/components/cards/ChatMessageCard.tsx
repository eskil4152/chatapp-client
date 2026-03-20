import { WsChat } from "@/src/types/WsChatTypes";
import styles from "@/src/style/modules/Chat.module.css";
import formatTimestamp from "@/src/lib/FormatTimestamp";

export default function ChatMessageCard(m: WsChat) {
  return (
    <div className={styles.message}>
      <div className={styles.messageTopRow}>
        <div className={styles.sender}>{m.username}</div>
        <div className={styles.timestamp}>{formatTimestamp(m.timestamp)}</div>
      </div>
      <div className={styles.content}>{m.content}</div>
    </div>
  );
}
