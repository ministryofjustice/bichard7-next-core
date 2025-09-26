import { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import getUserServiceAccess from "./getUserServiceAccess"

const userManagementUrlExpression = /^\/users\/users.*/
const bichardUrlExpression = /^\/bichard-ui.*/
const newBichardUrlExpression = /^\/bichard\/.*|^\/bichard$\/?/
const reportsUrlExpression = /^\/reports\/.*/

export default (token: AuthenticationTokenPayload, url?: string): boolean => {
  if (!url) {
    return false
  }

  const { hasAccessToBichard, hasAccessToUserManagement, hasAccessToReports, hasAccessToNewBichard } =
    getUserServiceAccess(token)

  if (
    (url.match(userManagementUrlExpression) && !hasAccessToUserManagement) ||
    (url.match(bichardUrlExpression) && !hasAccessToBichard) ||
    (url.match(reportsUrlExpression) && !hasAccessToReports) ||
    (url.match(newBichardUrlExpression) && !hasAccessToNewBichard)
  ) {
    return false
  }

  return true
}
