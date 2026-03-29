"use client";

import useLoading from "@/src/shared/hooks/useLoading";
import getUser from "@/src/features/user/api/getUser";

export default function useUser() {
  return useLoading(getUser);
}
