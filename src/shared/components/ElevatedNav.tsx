"use client";

import Link from "next/link";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { isAtLeastSiteRole } from "@/src/shared/lib/siteRole";

export default function ElevatedNav() {
  const { siteRole } = useAuth();

  const showSiteInfo = isAtLeastSiteRole(siteRole, "TRUSTED");
  const showAdministrative = isAtLeastSiteRole(siteRole, "MODERATOR");

  if (!showSiteInfo && !showAdministrative) return null;

  return (
    <>
      {showSiteInfo && <Link href="/site-info">Site Info</Link>}
      {showAdministrative && <Link href="/admin">Administrative</Link>}
      <span className="headerDivider">|</span>
    </>
  );
}