"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/src/style/modules/Invites.module.css";
import { OutgoingInvite } from "@/src/features/invites/types";
import { useInvites } from "@/src/shared/providers/InviteProvider";
import getOutgoingInvites from "@/src/features/invites/api/getOutgoingInvites";
import respondToInvite from "@/src/features/invites/api/respondToInvite";
import IncomingInviteCard from "./IncomingInviteCard";
import OutgoingInviteCard from "./OutgoingInviteCard";
import LoadingOverlay from "@/src/features/chat/components/LoadingOverlay";

type Tab = "incoming" | "outgoing";

export default function InvitesPanel() {
  const { pendingCount, pendingInvites, setPendingInvites } = useInvites();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("incoming");
  const [outgoing, setOutgoing] = useState<OutgoingInvite[]>([]);
  const [loadingOutgoing, setLoadingOutgoing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  async function fetchOutgoing() {
    setLoadingOutgoing(true);

    const outRes = await getOutgoingInvites();

    if (outRes.status === 200 && Array.isArray(outRes.data)) {
      setOutgoing(outRes.data as OutgoingInvite[]);
    }

    setLoadingOutgoing(false);
  }

  useEffect(() => {
    if (open && tab === "outgoing") {
      void fetchOutgoing();
    }
  }, [open, tab]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleAccept(id: string) {
    const res = await respondToInvite(id, "ACCEPTED");

    if (res.ok) {
      setPendingInvites((prev) => prev.filter((invite) => invite.id !== id));
    }
  }

  async function handleReject(id: string) {
    const res = await respondToInvite(id, "REJECTED");

    if (res.ok) {
      setPendingInvites((prev) => prev.filter((invite) => invite.id !== id));
    }
  }

  return (
    <div className={styles.inviteToggleWrapper} ref={wrapperRef}>
      <button
        className={styles.inviteToggle}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        Invites
        {pendingCount > 0 && (
          <span className={styles.badge}>{pendingCount}</span>
        )}
      </button>

      {open && (
        <div className={styles.panel}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === "incoming" ? styles.activeTab : ""}`}
              onClick={() => setTab("incoming")}
            >
              Incoming{pendingCount > 0 ? ` (${pendingCount})` : ""}
            </button>

            <button
              className={`${styles.tab} ${tab === "outgoing" ? styles.activeTab : ""}`}
              onClick={() => setTab("outgoing")}
            >
              Outgoing
            </button>
          </div>

          <div className={styles.panelBody}>
            {tab === "incoming" ? (
              pendingInvites.length === 0 ? (
                <p className={styles.empty}>No pending invites</p>
              ) : (
                pendingInvites.map((invite) => (
                  <IncomingInviteCard
                    key={invite.id}
                    invite={invite}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))
              )
            ) : loadingOutgoing ? (
              <LoadingOverlay />
            ) : outgoing.length === 0 ? (
              <p className={styles.empty}>No outgoing invites</p>
            ) : (
              outgoing.map((invite) => (
                <OutgoingInviteCard key={invite.id} invite={invite} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
