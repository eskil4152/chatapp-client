import {
  BanUserDTO,
  BannedUserDTO,
  ElevatedUserDTO,
  UserDetailDTO,
  UserIdDTO,
  UserRoleDTO,
} from "@/src/features/admin/types";

const base = () => process.env.NEXT_PUBLIC_SERVER_API_URL;

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", ...options });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (res.status === 403) throw new Error("FORBIDDEN");
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error("FETCH_FAILED");
  return res.json() as Promise<T>;
}

async function apiPost(url: string, body: unknown): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (res.status === 403) throw new Error("FORBIDDEN");
  if (!res.ok) throw new Error("FETCH_FAILED");
}

export function getElevatedUsers(): Promise<ElevatedUserDTO[]> {
  return apiFetch(`${base()}/api/admin/users`);
}

export function getUser(username: string): Promise<UserDetailDTO> {
  return apiFetch(`${base()}/api/admin/user/${username}`);
}

export function changeUserRole(dto: UserRoleDTO): Promise<void> {
  return apiPost(`${base()}/api/admin/change-user-role`, dto);
}

export function banUser(dto: BanUserDTO): Promise<void> {
  return apiPost(`${base()}/api/admin/ban-user`, dto);
}

export function unbanUser(dto: UserIdDTO): Promise<void> {
  return apiPost(`${base()}/api/admin/unban-user`, dto);
}

export function getBannedUsers(
  page: number,
  size: number,
): Promise<BannedUserDTO[]> {
  return apiFetch(`${base()}/api/admin/banned?page=${page}&size=${size}`);
}
