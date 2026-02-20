import type { UserDto } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import Permission from "@moj-bichard7/common/types/Permission"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { OK } from "http-status"

import { SetupAppEnd2EndHelper } from "../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../../tests/helpers/userHelper"

describe("/v1/me e2e", () => {
  const endpoint = V1.Me
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will return the current user with a correct JWT", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.postgres)

    const response = await fetch(`${helper.address}${endpoint}`, {
      headers: { Authorization: `Bearer ${encodedJwt}` },
      method: "GET"
    })

    const responseUser: UserDto = {
      email: user.email,
      excludedTriggers: "",
      featureFlags: {},
      forenames: user.forenames,
      fullname: `${user.forenames} ${user.surname}`,
      groups: [UserGroup.GeneralHandler],
      hasAccessTo: {
        [Permission.CanAuditCases]: false,
        [Permission.CanListUsers]: false,
        [Permission.CanResubmit]: true,
        [Permission.CaseDetailsSidebar]: true,
        [Permission.Exceptions]: true,
        [Permission.ListAllCases]: false,
        [Permission.Triggers]: true,
        [Permission.UnlockOtherUsersCases]: false,
        [Permission.ViewReports]: false,
        [Permission.ViewUserManagement]: false
      },
      surname: user.surname,
      username: user.username,
      visibleCourts: "AB",
      visibleForces: ["01"]
    }

    expect(response.status).toBe(OK)
    expect(await response.json()).toEqual(responseUser)
  })

  it("returns the supervisor user with a correct JWT", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])

    const response = await fetch(`${helper.address}${endpoint}`, {
      headers: { Authorization: `Bearer ${encodedJwt}` },
      method: "GET"
    })

    const responseUser: UserDto = {
      email: user.email,
      excludedTriggers: "",
      featureFlags: {},
      forenames: user.forenames,
      fullname: `${user.forenames} ${user.surname}`,
      groups: user.groups,
      hasAccessTo: {
        [Permission.CanAuditCases]: true,
        [Permission.CanListUsers]: true,
        [Permission.CanResubmit]: true,
        [Permission.CaseDetailsSidebar]: true,
        [Permission.Exceptions]: true,
        [Permission.ListAllCases]: true,
        [Permission.Triggers]: true,
        [Permission.UnlockOtherUsersCases]: true,
        [Permission.ViewReports]: true,
        [Permission.ViewUserManagement]: false
      },
      surname: user.surname,
      username: user.username,
      visibleCourts: "AB",
      visibleForces: ["01"]
    }

    expect(response.status).toBe(OK)
    expect(await response.json()).toEqual(responseUser)
  })

  it("will return the current user that has user groups, with a correct JWT", async () => {
    const expectedGroups = [UserGroup.TriggerHandler, UserGroup.NewUI, UserGroup.ExceptionHandler]
    const [encodedJwt, user] = await createUserAndJwtToken(helper.postgres, expectedGroups)

    const response = await fetch(`${helper.address}${endpoint}`, {
      headers: { Authorization: `Bearer ${encodedJwt}` },
      method: "GET"
    })

    expect(response.status).toBe(OK)

    const responseUser = (await response.json()) as UserDto
    expect(responseUser.username).toEqual(user.username)
    expect(responseUser.email).toEqual(user.email)
    expect(responseUser.groups).toEqual(expect.arrayContaining(expectedGroups))
  })
})
