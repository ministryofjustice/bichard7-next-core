import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type { FastifyInstance } from "fastify"
import { OK } from "http-status"
import { SetupAppEnd2EndHelper } from "../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../tests/helpers/userHelper"

describe("/me e2e", () => {
  const endpoint = "/me"
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.gateway.clearDb()
  })

  afterAll(async () => {
    await app.close()
    await helper.gateway.close()
  })

  it("will return the current user with a correct JWT", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.gateway)

    const response = await fetch(`${helper.address}${endpoint}`, {
      method: "GET",
      headers: {
        "X-API-Key": "password",
        Authorization: `Bearer ${encodedJwt}`
      }
    })

    const responseUser = {
      username: user.username,
      email: user.email,
      groups: [UserGroup.GeneralHandler]
    }

    expect(response.status).toBe(OK)
    expect(await response.json()).toEqual(responseUser)
  })

  it("will return the current user that has user groups, with a correct JWT", async () => {
    const expectedGroups = [UserGroup.TriggerHandler, UserGroup.NewUI, UserGroup.ExceptionHandler]
    const [encodedJwt, user] = await createUserAndJwtToken(helper.gateway, expectedGroups)

    const response = await fetch(`${helper.address}${endpoint}`, {
      method: "GET",
      headers: {
        "X-API-Key": "password",
        Authorization: `Bearer ${encodedJwt}`
      }
    })

    expect(response.status).toBe(OK)

    const responseUser = await response.json()
    expect(responseUser.username).toEqual(user.username)
    expect(responseUser.email).toEqual(user.email)
    expect(responseUser.groups).toEqual(expect.arrayContaining(expectedGroups))
  })

  it("will throw an error with a user that has no groups", async () => {
    const noGroups: UserGroup[] = []

    await expect(createUserAndJwtToken(helper.gateway, noGroups)).rejects.toThrow("User has no Groups")
  })
})
