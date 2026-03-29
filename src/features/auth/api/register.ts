export default async function register(username: string, password: string) {
  return await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    credentials: "include",
  });
}
