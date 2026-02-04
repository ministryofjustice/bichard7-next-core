import { NavLink } from "types/NavLinks"
import type { NextRouter } from "next/router"

export function isNavLinkForRoute(router: NextRouter, navLink: NavLink): boolean {
  const { query, pathname } = router
  const previousPath = query["previousPath"] ?? ""

  switch (navLink) {
    case NavLink.Audit:
      return previousPath.includes("/audit") || pathname.includes("/audit")
    case NavLink.CaseList:
      return !previousPath.includes("/audit") && (pathname.includes("/court-cases") || pathname === "/")
    default:
      return false
  }
}
