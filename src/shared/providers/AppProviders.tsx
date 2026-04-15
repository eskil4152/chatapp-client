"use client";

import React from "react";
import { AuthProvider } from "@/src/shared/providers/AuthProvider";
import { AppSocketProvider } from "@/src/shared/providers/AppSocketProvider";
import { FriendPresenceProvider } from "@/src/shared/providers/FriendPresenceProvider";
import { InviteProvider } from "@/src/shared/providers/InviteProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppSocketProvider>
        <FriendPresenceProvider>
          <InviteProvider>{children}</InviteProvider>
        </FriendPresenceProvider>
      </AppSocketProvider>
    </AuthProvider>
  );
}