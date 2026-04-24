"use client";

import { useEffect, useState } from "react";
import { getSiteInfo, getAdvancedSiteInfo } from "@/src/features/admin/api/adminApi";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { isAtLeastSiteRole } from "@/src/shared/lib/userRole";
import { SiteInfoDTO, AdvancedSiteInfoDTO } from "@/src/features/admin/types";

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  parts.push(`${m}m`);
  return parts.join(" ");
}

export default function SiteInfo() {
  const { user } = useAuth();
  const isAdmin = isAtLeastSiteRole(user?.userRole, "ADMIN");

  const [info, setInfo] = useState<SiteInfoDTO | null>(null);
  const [infoError, setInfoError] = useState(false);
  const [advanced, setAdvanced] = useState<AdvancedSiteInfoDTO | null>(null);
  const [advancedLoading, setAdvancedLoading] = useState(false);
  const [advancedError, setAdvancedError] = useState(false);

  useEffect(() => {
    getSiteInfo()
      .then(setInfo)
      .catch(() => setInfoError(true));
  }, []);

  async function handleLoadAdvanced() {
    setAdvancedLoading(true);
    setAdvancedError(false);
    try {
      setAdvanced(await getAdvancedSiteInfo());
    } catch {
      setAdvancedError(true);
    } finally {
      setAdvancedLoading(false);
    }
  }

  if (infoError) return <p className="errorBox">Failed to load site info.</p>;
  if (!info) return <p className="itemMeta">Loading…</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="card">
        <div className="siteInfoRow">
          <span className="itemMeta">Connected users</span>
          <span className="itemName">{info.connectedUsers}</span>
        </div>
        <div className="siteInfoRow">
          <span className="itemMeta">Total sessions</span>
          <span className="itemName">{info.totalSessions}</span>
        </div>
        <div className="siteInfoRow">
          <span className="itemMeta">Active rooms</span>
          <span className="itemName">{info.activeRooms}</span>
        </div>
        <div className="siteInfoRow">
          <span className="itemMeta">Total users</span>
          <span className="itemName">{info.totalUsers}</span>
        </div>
        <div className="siteInfoRow">
          <span className="itemMeta">Total rooms</span>
          <span className="itemName">{info.totalRooms}</span>
        </div>
        <div className="siteInfoRow">
          <span className="itemMeta">Banned users</span>
          <span className="itemName">{info.bannedUsers}</span>
        </div>
      </div>

      {isAdmin && !advanced && (
        <button
          className="secondaryButton"
          onClick={handleLoadAdvanced}
          disabled={advancedLoading}
          style={{ alignSelf: "flex-start" }}
        >
          {advancedLoading ? "Loading…" : "Advanced Site Info"}
        </button>
      )}

      {advancedError && <p className="errorBox">Failed to load advanced info.</p>}

      {advanced && (
        <>
          <div className="card">
            <h2 className="pageTitle" style={{ fontSize: "1rem", marginBottom: 8 }}>JVM</h2>
            <div className="siteInfoRow">
              <span className="itemMeta">Memory used</span>
              <span className="itemName">{advanced.jvmMemoryUsedMb.toFixed(1)} MB</span>
            </div>
            <div className="siteInfoRow">
              <span className="itemMeta">Memory committed</span>
              <span className="itemName">{advanced.jvmMemoryCommittedMb.toFixed(1)} MB</span>
            </div>
            <div className="siteInfoRow">
              <span className="itemMeta">Memory max</span>
              <span className="itemName">{advanced.jvmMemoryMaxMb.toFixed(1)} MB</span>
            </div>
            <div className="siteInfoRow">
              <span className="itemMeta">Threads (live / peak)</span>
              <span className="itemName">{advanced.jvmThreadsLive} / {advanced.jvmThreadsPeak}</span>
            </div>
            <div className="siteInfoRow">
              <span className="itemMeta">CPU usage</span>
              <span className="itemName">{advanced.cpuUsagePercent.toFixed(1)}%</span>
            </div>
            <div className="siteInfoRow">
              <span className="itemMeta">GC pause (mean / max)</span>
              <span className="itemName">{advanced.gcPauseMeanMs.toFixed(1)} ms / {advanced.gcPauseMaxMs.toFixed(1)} ms</span>
            </div>
            <div className="siteInfoRow">
              <span className="itemMeta">Uptime</span>
              <span className="itemName">{formatUptime(advanced.uptimeSeconds)}</span>
            </div>
          </div>

          {advanced.httpRequests.length > 0 && (
            <div className="card" style={{ overflowX: "auto" }}>
              <h2 className="pageTitle" style={{ fontSize: "1rem", marginBottom: 12 }}>HTTP Requests</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
                    <th style={{ padding: "6px 12px 6px 0", fontWeight: 500 }}>Endpoint</th>
                    <th style={{ padding: "6px 12px", fontWeight: 500 }}>Method</th>
                    <th style={{ padding: "6px 12px", fontWeight: 500 }}>Status</th>
                    <th style={{ padding: "6px 12px", fontWeight: 500 }}>Count</th>
                    <th style={{ padding: "6px 12px", fontWeight: 500 }}>Mean</th>
                    <th style={{ padding: "6px 12px", fontWeight: 500 }}>Max</th>
                  </tr>
                </thead>
                <tbody>
                  {advanced.httpRequests.map((r, i) =>
                    r.statuses.map((s, j) => (
                      <tr key={`${i}-${j}`} style={{ borderTop: "1px solid var(--border-soft)" }}>
                        {j === 0 ? (
                          <>
                            <td rowSpan={r.statuses.length} style={{ padding: "8px 12px 8px 0", color: "var(--text-soft)", fontFamily: "monospace", verticalAlign: "top" }}>{r.uri}</td>
                            <td rowSpan={r.statuses.length} style={{ padding: "8px 12px", verticalAlign: "top" }}>{r.method}</td>
                          </>
                        ) : null}
                        <td style={{ padding: "8px 12px" }}>{s.status}</td>
                        <td style={{ padding: "8px 12px" }}>{s.count}</td>
                        {j === 0 ? (
                          <>
                            <td rowSpan={r.statuses.length} style={{ padding: "8px 12px", verticalAlign: "top" }}>{r.meanMs === 0 ? "—" : `${r.meanMs.toFixed(1)} ms`}</td>
                            <td rowSpan={r.statuses.length} style={{ padding: "8px 12px", verticalAlign: "top" }}>{r.maxMs === 0 ? "—" : `${r.maxMs.toFixed(1)} ms`}</td>
                          </>
                        ) : null}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
