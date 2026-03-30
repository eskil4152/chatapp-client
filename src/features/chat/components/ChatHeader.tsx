import styles from "@/src/style/modules/Chat.module.css";

type ChatHeaderProps = {
  roomName: string;
  encrypted: boolean;
};

export default function ChatHeader({ roomName, encrypted }: ChatHeaderProps) {
  return (
    <h2 className={styles.title}>
      {roomName || "Room"}{" "}
      {roomName && (
        <span className={styles.roomMeta}>
          {encrypted ? "Encrypted" : "Not encrypted"}
        </span>
      )}
    </h2>
  );
}
