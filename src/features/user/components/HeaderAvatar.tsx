"use client";

import Link from "next/link";
import Image from "next/image";
import useUser from "@/src/features/user/hooks/useUser";
import defaultImg from "@/public/images/default_profile.png";

export default function HeaderAvatar() {
  const { response } = useUser();

  const avatarUrl =
    response?.status === 200
      ? (response.data as { avatarUrl?: string }).avatarUrl
      : null;

  const src =
    avatarUrl?.startsWith("http") ? avatarUrl : defaultImg;

  return (
    <Link href="/user" className="headerAvatar">
      <Image
        src={src}
        alt="My profile"
        width={34}
        height={34}
      />
    </Link>
  );
}
