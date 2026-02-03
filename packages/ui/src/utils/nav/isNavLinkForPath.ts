import { NavLink } from "types/NavLinks"

export function isNavLinkForPath(path: string, navLink: string): boolean {
  // court-cases linked back to by /audit should be shown as part of the Audit section
  if (path.includes("audit") && navLink !== NavLink.Audit) {
    return false
  }

  if (navLink === NavLink.Audit) {
    return path.includes("/audit")
  } else if (navLink === NavLink.CaseList) {
    return path.startsWith("/?") || path === "/" || path.includes("/court-cases")
  }

  return false
}
