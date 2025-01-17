import type { UserDto } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { OK } from "http-status"

import { V1 } from "../../endpoints/versionedEndpoints"
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
    await helper.db.clearDb()
  })

  afterAll(async () => {
    await app.close()
    await helper.db.close()
  })

  it("will return the current user with a correct JWT", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.db)

    const response = await fetch(`${helper.address}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${encodedJwt}`
      },
      method: "GET"
    })

    const responseUser: UserDto = {
      email: user.email,
      featureFlags: {},
      forenames: user.forenames,
      fullname: `${user.forenames} ${user.surname}`,
      groups: [UserGroup.GeneralHandler],
      hasAccessTo: {
        "0": true,
        "1": true,
        "2": true,
        "3": false,
        "4": false,
        "5": false,
        "6": false,
        "7": true
      },
      surname: user.surname,
      username: user.username,
      visibleForces: "001"
    }

    expect(response.status).toBe(OK)
    expect(await response.json()).toEqual(responseUser)
  })

  it("will return the current user that has user groups, with a correct JWT", async () => {
    const expectedGroups = [UserGroup.TriggerHandler, UserGroup.NewUI, UserGroup.ExceptionHandler]
    const [encodedJwt, user] = await createUserAndJwtToken(helper.db, expectedGroups)

    const response = await fetch(`${helper.address}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${encodedJwt}`
      },
      method: "GET"
    })

    expect(response.status).toBe(OK)

    const responseUser = await response.json()
    expect(responseUser.username).toEqual(user.username)
    expect(responseUser.email).toEqual(user.email)
    expect(responseUser.groups).toEqual(expect.arrayContaining(expectedGroups))
  })

  it("will throw an error with a user that has no groups", async () => {
    const noGroups: UserGroup[] = []

    await expect(createUserAndJwtToken(helper.db, noGroups)).rejects.toThrow("User has no Groups")
  })
})
