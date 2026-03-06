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
        <header>
          <Link href="/user">
            <p>My info</p>
          </Link>

          <Link href="/rooms">
            <p>My rooms</p>
          </Link>
        </header>

        {children}
      </body>
    </html>
  );
}
