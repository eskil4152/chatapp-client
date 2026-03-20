export default async function ChangePasswordAPI(
  oldPassword: string,
  newPassword: string,
) {
  return await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/user/edit/password`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
      credentials: "include",
    },
  );
}
