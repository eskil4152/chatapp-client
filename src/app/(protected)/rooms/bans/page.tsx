"use client";

import { Suspense } from "react";
import BanListClient from "@/src/features/rooms/components/BanListClient";

export default function BanList() {
  return (
    <Suspense fallback={<div className="text-center">Loading…</div>}>
      <BanListClient />
    </Suspense>
  );
}
