"use client";

import Link from "next/link";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { isAtLeastSiteRole } from "@/src/shared/lib/userRole";

export default function ElevatedNav() {
  const { user } = useAuth();

  const showSiteInfo = isAtLeastSiteRole(user?.userRole, "TRUSTED");
  const showAdministrative = isAtLeastSiteRole(user?.userRole, "MODERATOR");

  if (!showSiteInfo && !showAdministrative) return null;

  return (
    <>
      {showSiteInfo && <Link href="/site-info">Site Info</Link>}
      {showAdministrative && <Link href="/admin">Administrative</Link>}
      <span className="headerDivider">|</span>
    </>
  );
}
