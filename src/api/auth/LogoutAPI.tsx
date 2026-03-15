export default async function LogoutAPI() {
  return await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/logout`, {
    method: "POST",
    credentials: "include",
  });
}
