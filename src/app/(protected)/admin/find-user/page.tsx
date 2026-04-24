"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { isAtLeastSiteRole } from "@/src/shared/lib/userRole";
import FindUser from "@/src/features/admin/components/FindUser";

export default function FindUserPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user === undefined) return;
    if (!isAtLeastSiteRole(user?.userRole, "MODERATOR")) router.replace("/rooms");
  }, [user, router]);

  return (
    <div className="pageList">
      <h1 className="pageTitle">Find User</h1>
      <FindUser />
    </div>
  );
}
