import type { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import getUserServiceAccess from "useCases/getUserServiceAccess"

it("should say that user has access to Bichard and the reports service when user has one of the Bichard's user groups", () => {
  const result = getUserServiceAccess({ groups: ["B7Allocator"] } as AuthenticationTokenPayload)

  const { hasAccessToBichard, hasAccessToUserManagement, hasAccessToReports } = result
  expect(hasAccessToBichard).toBe(true)
  expect(hasAccessToUserManagement).toBe(false)
  expect(hasAccessToReports).toBe(true)
})

it("should say that user has only access to User Management when user has one of the User Management's user groups", () => {
  const result = getUserServiceAccess({ groups: ["B7UserManager"] } as AuthenticationTokenPayload)

  const { hasAccessToBichard, hasAccessToUserManagement, hasAccessToReports } = result
  expect(hasAccessToBichard).toBe(false)
  expect(hasAccessToUserManagement).toBe(true)
  expect(hasAccessToReports).toBe(false)
})

it("should say that user has access to all services when user has at least one user group of each service", () => {
  const result = getUserServiceAccess({
    groups: ["B7UserManager", "B7AuditLoggingManager", "B7ExceptionHandler"]
  } as AuthenticationTokenPayload)

  const { hasAccessToBichard, hasAccessToUserManagement, hasAccessToReports } = result
  expect(hasAccessToBichard).toBe(true)
  expect(hasAccessToUserManagement).toBe(true)
  expect(hasAccessToReports).toBe(true)
})

it("should say that user does not have access to any of the services when user group is unknown", () => {
  const result = getUserServiceAccess({ groups: ["B7UnknownGroup"] } as any as AuthenticationTokenPayload)

  const { hasAccessToBichard, hasAccessToUserManagement, hasAccessToReports } = result
  expect(hasAccessToBichard).toBe(false)
  expect(hasAccessToUserManagement).toBe(false)
  expect(hasAccessToReports).toBe(false)
})
