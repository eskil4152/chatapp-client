"use client";

import useLoading from "@/src/shared/hooks/useLoading";
import getRooms from "@/src/features/rooms/api/getRooms";

export default function useRooms() {
  return useLoading(getRooms);
}
