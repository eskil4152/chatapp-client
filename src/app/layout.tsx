import "../style/globals.css";
import Link from "next/link";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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
            <Link href="/user">My info</Link>
          </div>
        </header>

        <main className="main">{children}</main>
      </body>
    </html>
  );
}
