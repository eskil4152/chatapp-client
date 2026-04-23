"use client";

import React, { useEffect, useState } from "react";
import styles from "@/src/style/modules/LoadingOverlay.module.css";

export default function LoadingOverlay({
  visible = true,
}: {
  visible?: boolean;
}) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo.png" alt="Ping" className={styles.mark} />
      <span className={styles.label}>Loading{dots}</span>
    </div>
  );
}
