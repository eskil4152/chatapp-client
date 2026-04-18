"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { isAtLeastSiteRole } from "@/src/shared/lib/siteRole";
import FindUser from "@/src/features/admin/components/FindUser";

export default function FindUserPage() {
  const router = useRouter();
  const { siteRole } = useAuth();

  useEffect(() => {
    if (!isAtLeastSiteRole(siteRole, "MODERATOR")) router.replace("/rooms");
  }, [siteRole, router]);

  return (
    <div className="pageList">
      <h1 className="pageTitle">Find User</h1>
      <FindUser />
    </div>
  );
}
