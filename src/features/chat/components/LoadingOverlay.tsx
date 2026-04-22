import React from "react";
import styles from "@/src/style/modules/LoadingOverlay.module.css";

function PingMark({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      className={styles.mark}
    >
      <rect width="52" height="52" rx="14" fill="#78AC83" />
      <path
        d="M 15 43 L 15 14 L 27 14 C 34 14 38 18 38 24 C 38 30 34 34 27 34 L 15 34"
        stroke="white"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LoadingOverlay({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <PingMark size={56} />
      <span className={styles.label}>Loading...</span>
    </div>
  );
}
