import Link from "next/link";
import { AppSocketProvider } from "@/src/shared/providers/AppSocketProvider";
import { FriendPresenceProvider } from "@/src/shared/providers/FriendPresenceProvider";
import HeaderAvatar from "@/src/features/user/components/HeaderAvatar";
import ConnectionIndicator from "@/src/shared/components/ConnectionIndicator";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSocketProvider>
      <FriendPresenceProvider>
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

        <ConnectionIndicator />
        <main className="main">{children}</main>
      </FriendPresenceProvider>
    </AppSocketProvider>
  );
}
