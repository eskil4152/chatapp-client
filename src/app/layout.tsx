import "../style/globals.css";
import Link from "next/link";
import React from "react";
import { AppSocketProvider } from "@/src/shared/providers/AppSocketProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>ChatApp</title>
      </head>
      <body>
        <AppSocketProvider>
          <header className="header">
            <div className="headerLeft">
              <Link href="/" className="logo">
                ChatApp
              </Link>
            </div>

            <nav className="headerCenter">
              <Link href="/rooms">My rooms</Link>
            </nav>

            <div className="headerRight">
              <Link href="/friends">My friends</Link>
              <Link href="/user">My info</Link>
            </div>
          </header>

          <main className="main">{children}</main>
        </AppSocketProvider>
      </body>
    </html>
  );
}
