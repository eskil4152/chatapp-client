"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { isAtLeastSiteRole } from "@/src/shared/lib/siteRole";
import ElevatedUsersList from "@/src/features/admin/components/ElevatedUsersList";

export default function ElevatedUsersPage() {
  const router = useRouter();
  const { siteRole } = useAuth();

  useEffect(() => {
    if (!isAtLeastSiteRole(siteRole, "MODERATOR")) router.replace("/rooms");
  }, [siteRole, router]);

  return (
    <div className="pageList">
      <h1 className="pageTitle">Elevated Users</h1>
      <ElevatedUsersList />
    </div>
  );
}
