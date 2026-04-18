"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { isAtLeastSiteRole } from "@/src/shared/lib/siteRole";

export default function AdminPage() {
  const router = useRouter();
  const { siteRole } = useAuth();

  useEffect(() => {
    if (!isAtLeastSiteRole(siteRole, "MODERATOR")) {
      router.replace("/rooms");
    }
  }, [siteRole, router]);

  return (
    <div className="pageList">
      <h1 className="pageTitle">Administrative</h1>
      <div className="adminHubGrid">
        <Link href="/admin/elevated-users" className="adminHubCard">
          <span className="itemName">Elevated Users</span>
          <span className="itemMeta">View and manage privileged accounts</span>
        </Link>
        <Link href="/admin/find-user" className="adminHubCard">
          <span className="itemName">Find User</span>
          <span className="itemMeta">Look up a specific user by username</span>
        </Link>
        <Link href="/admin/ban-list" className="adminHubCard">
          <span className="itemName">Ban List</span>
          <span className="itemMeta">View and manage banned users</span>
        </Link>
      </div>
    </div>
  );
}
