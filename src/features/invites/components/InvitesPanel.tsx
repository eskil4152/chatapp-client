"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/src/style/modules/Invites.module.css";
import { PendingInvite, OutgoingInvite } from "@/src/features/invites/types";
import { useInvites } from "@/src/shared/providers/InviteProvider";
import getPendingInvites from "@/src/features/invites/api/getPendingInvites";
import getOutgoingInvites from "@/src/features/invites/api/getOutgoingInvites";
import respondToInvite from "@/src/features/invites/api/respondToInvite";
import IncomingInviteCard from "./IncomingInviteCard";
import OutgoingInviteCard from "./OutgoingInviteCard";

type Tab = "incoming" | "outgoing";

export default function InvitesPanel() {
  const { pendingCount, setPendingCount } = useInvites();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("incoming");
  const [incoming, setIncoming] = useState<PendingInvite[]>([]);
  const [outgoing, setOutgoing] = useState<OutgoingInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  async function fetchData() {
    setLoading(true);
    const [inRes, outRes] = await Promise.all([
      getPendingInvites(),
      getOutgoingInvites(),
    ]);
    if (inRes.status === 200 && Array.isArray(inRes.data)) {
      setIncoming(inRes.data as PendingInvite[]);
      setPendingCount(inRes.data.length);
    }
    if (outRes.status === 200 && Array.isArray(outRes.data)) {
      setOutgoing(outRes.data as OutgoingInvite[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (open) {
      void fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleAccept(id: string) {
    await respondToInvite(id, "ACCEPTED");
    void fetchData();
  }

  async function handleReject(id: string) {
    await respondToInvite(id, "REJECTED");
    void fetchData();
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
            {loading ? (
              <p className={styles.empty}>Loading...</p>
            ) : tab === "incoming" ? (
              incoming.length === 0 ? (
                <p className={styles.empty}>No pending invites</p>
              ) : (
                incoming.map((invite) => (
                  <IncomingInviteCard
                    key={invite.id}
                    invite={invite}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))
              )
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
