export default async function AddFriendAPI(username: string) {
  return await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/friends/add`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
      credentials: "include",
    },
  );
}
