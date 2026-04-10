import Link from "next/link";
import { AppSocketProvider } from "@/src/shared/providers/AppSocketProvider";
import { FriendPresenceProvider } from "@/src/shared/providers/FriendPresenceProvider";
import { InviteProvider } from "@/src/shared/providers/InviteProvider";
import HeaderAvatar from "@/src/features/user/components/HeaderAvatar";
import ConnectionIndicator from "@/src/shared/components/ConnectionIndicator";
import OnlineFriendsRail from "@/src/features/friends/components/OnlineFriendsRail";
import InvitesPanel from "@/src/features/invites/components/InvitesPanel";
import React from "react";
import InviteToast from "@/src/shared/components/InviteToast";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSocketProvider>
      <FriendPresenceProvider>
        <InviteProvider>
          <header className="header">
            <div className="headerLeft">
              <Link href="/" className="logo">
                ChatApp
              </Link>
            </div>

            <nav className="headerCenter">
              <Link href="/rooms">Rooms</Link>
            </nav>

            <div className="headerRight">
              <Link href="/friends">Friends</Link>
              <InvitesPanel />
              <HeaderAvatar />
            </div>
          </header>

          <ConnectionIndicator />

          <InviteToast />

          <div className="appShell">
            <aside className="onlineRail">
              <OnlineFriendsRail />
            </aside>

            <main className="main">{children}</main>
          </div>
        </InviteProvider>
      </FriendPresenceProvider>
    </AppSocketProvider>
  );
}
