"use client";

import Link from "next/link";
import HeaderAvatar from "@/src/features/user/components/HeaderAvatar";
import InvitesPanel from "@/src/features/invites/components/InvitesPanel";
import ElevatedNav from "@/src/shared/components/ElevatedNav";

export default function AppHeader() {
  return (
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
        <ElevatedNav />
        <Link href="/friends">Friends</Link>
        <InvitesPanel />
        <HeaderAvatar />
      </div>
    </header>
  );
}