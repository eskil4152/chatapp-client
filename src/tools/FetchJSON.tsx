export default async function fetchJSON(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await response.json();
  const status = response.status;

  return { status, data };
}
