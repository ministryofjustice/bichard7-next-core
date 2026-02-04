import { NavLink } from "types/NavLinks"

export function isNavLinkForPath(path: string, navLink: string): boolean {
  switch (navLink) {
    case NavLink.Audit:
      return path.includes("audit")
    case NavLink.CaseList:
      return !path.includes("audit") && (path.includes("/court-cases") || path.startsWith("/?") || path === "/")
    default:
      return false
  }
}
