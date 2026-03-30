import "../style/globals.css";
import React from "react";

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
      <body>{children}</body>
    </html>
  );
}
