"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/shared/providers/AuthProvider";
import { isAtLeastSiteRole } from "@/src/shared/lib/siteRole";

export default function SiteInfoPage() {
  const router = useRouter();
  const { siteRole } = useAuth();

  useEffect(() => {
    if (!isAtLeastSiteRole(siteRole, "TRUSTED")) {
      router.replace("/rooms");
    }
  }, [siteRole, router]);

  return (
    <div className="pageList">
      <h1 className="pageTitle">Site Info</h1>
      <p className="loadingText">Coming soon.</p>
    </div>
  );
}
