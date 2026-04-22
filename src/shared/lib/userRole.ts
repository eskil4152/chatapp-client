export const SITE_ROLES = [
  "USER",
  "TRUSTED",
  "MODERATOR",
  "ADMIN",
  "SUPERUSER",
] as const;

export type UserRole = (typeof SITE_ROLES)[number];

function siteRoleRank(role: string): number {
  const idx = SITE_ROLES.indexOf(role as UserRole);
  return idx === -1 ? 0 : idx;
}

export function isAtLeastSiteRole(
  userRole: string | undefined,
  required: UserRole,
): boolean {
  if (!userRole) return false;
  return siteRoleRank(userRole) >= siteRoleRank(required);
}
