export default async function getFriendInfo(userId: string) {
  return await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/friends/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
}
