import type { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import type UserGroup from "types/UserGroup"
import hasUserAccessToUrl from "useCases/hasUserAccessToUrl"

interface TestData {
  group: UserGroup | null
  url: string
  expectedResult: boolean
}

const testData: TestData[] = [
  {
    group: "B7UserManager",
    url: "/users/users",
    expectedResult: true
  },
  {
    group: "B7Allocator",
    url: "/users/users",
    expectedResult: false
  },
  {
    group: "B7AuditLoggingManager",
    url: "/users/users",
    expectedResult: false
  },
  {
    group: "B7SuperUserManager",
    url: "/users/users",
    expectedResult: false
  },
  {
    group: null,
    url: "/users/",
    expectedResult: true
  },
  {
    group: null,
    url: "/users",
    expectedResult: true
  },
  {
    group: null,
    url: "/users/account/change-password",
    expectedResult: true
  },
  {
    group: null,
    url: "/users/logout",
    expectedResult: true
  },
  {
    group: null,
    url: "/users/logout",
    expectedResult: true
  },
  {
    group: null,
    url: "/bichard",
    expectedResult: false
  },
  {
    group: null,
    url: "/bichard/",
    expectedResult: false
  },
  {
    group: "B7ExceptionHandler",
    url: "/bichard",
    expectedResult: false
  },
  {
    group: "B7NewUI",
    url: "/bichard",
    expectedResult: true
  },
  {
    group: "B7NewUI",
    url: "/bichard/",
    expectedResult: true
  },
  {
    group: "B7NewUI",
    url: "/bichard/court-cases/0",
    expectedResult: true
  },
  {
    group: "B7NewUI",
    url: "/bichard-ui/",
    expectedResult: false
  }
]

const bichardUsers = [
  "B7Allocator",
  "B7Audit",
  "B7ExceptionHandler",
  "B7GeneralHandler",
  "B7Supervisor",
  "B7TriggerHandler"
]

const nonBichardUsers = ["B7UserManager", "B7AuditLoggingManager"]

test.each(testData)("should return the correct result for %s", ({ group, url, expectedResult }) => {
  const token = { groups: group ? [group] : [] } as unknown as AuthenticationTokenPayload
  const result = hasUserAccessToUrl(token, url)

  expect(result).toBe(expectedResult)
})

test.each(bichardUsers)("should allow correct access for %s group", (group) => {
  const token = { groups: group ? [group] : [] } as unknown as AuthenticationTokenPayload

  expect(hasUserAccessToUrl(token, "/bichard-ui")).toBeTruthy()
  expect(hasUserAccessToUrl(token, "/reports/foo")).toBeTruthy()
})

test.each(nonBichardUsers)("should allow correct access for %s group", (group) => {
  const token = { groups: group ? [group] : [] } as unknown as AuthenticationTokenPayload

  expect(hasUserAccessToUrl(token, "/bichard-ui")).toBeFalsy()
  expect(hasUserAccessToUrl(token, "/reports/foo")).toBeFalsy()
})
