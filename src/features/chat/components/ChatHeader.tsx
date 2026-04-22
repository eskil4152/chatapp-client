import styles from "@/src/style/modules/Chat.module.css";

type ChatHeaderProps = {
  roomName: string;
  encrypted: boolean;
};

export default function ChatHeader({ roomName, encrypted }: ChatHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerSpacer} />
      <h2 className={styles.title}>{roomName || "Room"}</h2>
      <div className={styles.headerRight}>
        {roomName && (
          <span className={styles.roomMeta}>
            {encrypted ? "Encrypted" : "Not encrypted"}
          </span>
        )}
      </div>
    </div>
  );
}
