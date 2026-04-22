"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { isAtLeastSiteRole } from "@/src/shared/lib/userRole";
import BanList from "@/src/features/admin/components/BanList";

export default function BanListPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!isAtLeastSiteRole(user?.userRole, "MODERATOR")) router.replace("/rooms");
  }, [user, router]);

  return (
    <div className="pageList">
      <h1 className="pageTitle">Ban List</h1>
      <BanList />
    </div>
  );
}
