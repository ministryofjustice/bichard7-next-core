import type { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import getUserServiceAccess from "./getUserServiceAccess"

const userManagementUrlExpression = /^\/users\/users.*/
const bichardUrlExpression = /^\/bichard-ui.*/
const reportsUrlExpression = /^\/reports\/.*/

export default (token: AuthenticationTokenPayload, url?: string): boolean => {
  if (!url) {
    return false
  }

  const { hasAccessToBichard, hasAccessToUserManagement, hasAccessToReports } = getUserServiceAccess(token)

  if (
    (url.match(userManagementUrlExpression) && !hasAccessToUserManagement) ||
    (url.match(bichardUrlExpression) && !hasAccessToBichard) ||
    (url.match(reportsUrlExpression) && !hasAccessToReports)
  ) {
    return false
  }

  return true
}
