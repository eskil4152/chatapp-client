import Link from "next/link";
import React from "react";
import { AppSocketProvider } from "@/src/shared/providers/AppSocketProvider";
import HeaderAvatar from "@/src/features/user/components/HeaderAvatar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSocketProvider>
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
          <HeaderAvatar />
        </div>
      </header>

      <main className="main">{children}</main>
    </AppSocketProvider>
  );
}
