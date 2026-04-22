import React, { Suspense } from "react";
import AppProviders from "@/src/shared/providers/AppProviders";
import AppHeader from "@/src/shared/components/AppHeader";
import ConnectionIndicator from "@/src/shared/components/ConnectionIndicator";
import InviteToast from "@/src/shared/components/InviteToast";
import MessageNotificationToast from "@/src/shared/components/MessageNotificationToast";
import OnlineFriendsRail from "@/src/features/friends/components/OnlineFriendsRail";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProviders>
      <AppHeader />

      <ConnectionIndicator />

      <InviteToast />
      <Suspense><MessageNotificationToast /></Suspense>

      <div className="appShell">
        <aside className="onlineRail">
          <OnlineFriendsRail />
        </aside>

        <main className="main">{children}</main>
      </div>
    </AppProviders>
  );
}
