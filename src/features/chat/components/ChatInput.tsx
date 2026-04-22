import React, { useEffect } from "react";
import styles from "@/src/style/modules/Chat.module.css";

type ChatInputProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  canSend: boolean;
  onSend: () => void;
  onTyping?: () => void;
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export default function ChatInput({
  message,
  setMessage,
  canSend,
  onSend,
  onTyping,
  textAreaRef,
}: ChatInputProps) {
  useEffect(() => {
    const el = textAreaRef.current;
    if (!el) return;

    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
    >
      <textarea
        ref={textAreaRef}
        placeholder={canSend ? "Enter message" : "Slow down a moment"}
        disabled={!canSend}
        className={styles.input}
        value={message}
        onChange={(e) => { setMessage(e.target.value); onTyping?.(); }}
        onKeyDown={handleKeyDown}
        rows={1}
      />

      <button
        type="submit"
        disabled={!canSend}
        className={`primaryButton ${styles.button}`}
      >
        Send
      </button>
    </form>
  );
}
