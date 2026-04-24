"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { isAtLeastSiteRole } from "@/src/shared/lib/userRole";
import SiteInfo from "@/src/features/admin/components/SiteInfo";

export default function SiteInfoPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (!isAtLeastSiteRole(user.userRole, "TRUSTED")) {
      router.replace("/rooms");
    }
  }, [user, router]);

  return (
    <div className="pageList">
      <h1 className="pageTitle">Site Info</h1>
      <SiteInfo />
    </div>
  );
}
