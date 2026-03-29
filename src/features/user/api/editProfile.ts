export default async function editProfile(form: unknown) {
  return await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/user/edit`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
      credentials: "include",
    },
  );
}
