"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { isAtLeastSiteRole } from "@/src/shared/lib/userRole";
import ElevatedUsersList from "@/src/features/admin/components/ElevatedUsersList";

export default function ElevatedUsersPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!isAtLeastSiteRole(user?.userRole, "MODERATOR")) router.replace("/rooms");
  }, [user, router]);

  return (
    <div className="pageList">
      <h1 className="pageTitle">Elevated Users</h1>
      <ElevatedUsersList />
    </div>
  );
}
