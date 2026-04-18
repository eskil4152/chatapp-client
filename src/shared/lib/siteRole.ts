export const SITE_ROLES = [
  "USER",
  "TRUSTED",
  "MODERATOR",
  "ADMIN",
  "SUPERUSER",
] as const;

export type SiteRole = (typeof SITE_ROLES)[number];

function siteRoleRank(role: string): number {
  const idx = SITE_ROLES.indexOf(role as SiteRole);
  return idx === -1 ? 0 : idx;
}

export function isAtLeastSiteRole(
  userRole: string | undefined,
  required: SiteRole
): boolean {
  if (!userRole) return false;
  return siteRoleRank(userRole) >= siteRoleRank(required);
}