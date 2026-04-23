export function clearSession() {
  sessionStorage.removeItem("siteRole");
  sessionStorage.removeItem("auth");
}
