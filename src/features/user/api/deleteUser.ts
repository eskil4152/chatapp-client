export default async function deleteUser() {
  return await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/user/delete`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
}
