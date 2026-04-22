"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { isAtLeastSiteRole } from "@/src/shared/lib/userRole";

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
      <p className="loadingText">Coming soon.</p>
    </div>
  );
}
