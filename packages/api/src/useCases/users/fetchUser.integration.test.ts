import type { UserDto } from "@moj-bichard7/common/types/User"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import FakeLogger from "../../tests/helpers/fakeLogger"
import { createUser } from "../../tests/helpers/userHelper"
import End2EndPostgres from "../../tests/testGateways/e2ePostgres"
import { NotAllowedError } from "../../types/errors/NotAllowedError"
import fetchUser from "./fetchUser"

const testDatabaseGateway = new End2EndPostgres()

describe("fetchUser", () => {
  const logger = new FakeLogger()

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should return user if current user is a supervisor", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.GeneralHandler], visibleForces: ["001"] })
    const supervisor = await createUser(testDatabaseGateway, { groups: [UserGroup.Supervisor], visibleForces: ["01"] })

    const userResult = (await fetchUser(testDatabaseGateway.readonly, supervisor, logger, user.id)) as UserDto

    expect(userResult.username).toBe(user.username)
  })

  it("should return a 'not allowed' error if current user is not a supervisor", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.GeneralHandler], visibleForces: ["001"] })

    const result = await fetchUser(testDatabaseGateway.readonly, user, logger, user.id)

    expect(result).toBeInstanceOf(NotAllowedError)
  })
})
