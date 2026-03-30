"use client";

import useLoading from "@/src/shared/hooks/useLoading";
import getFriends from "@/src/features/friends/api/getFriends";

export default function useFriends() {
  return useLoading(getFriends);
}
