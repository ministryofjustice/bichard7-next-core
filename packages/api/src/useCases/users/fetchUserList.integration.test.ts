import type { UserList } from "@moj-bichard7/common/types/User"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import FakeLogger from "../../tests/helpers/fakeLogger"
import { createUser } from "../../tests/helpers/userHelper"
import End2EndPostgres from "../../tests/testGateways/e2ePostgres"
import { NotAllowedError } from "../../types/errors/NotAllowedError"
import fetchUserList from "./fetchUserList"

const testDatabaseGateway = new End2EndPostgres()

describe("fetchUserList", () => {
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

  it("should show users if current user is a supervisor", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.GeneralHandler], visibleForces: ["001"] })
    const supervisor = await createUser(testDatabaseGateway, { groups: [UserGroup.Supervisor], visibleForces: ["001"] })

    const userList = (await fetchUserList(testDatabaseGateway.readonly, supervisor, logger)) as UserList

    expect(userList.users.map((u) => u.username)).toEqual(expect.arrayContaining([user.username]))
    expect(userList.users.map((u) => u.username)).toEqual(expect.arrayContaining([supervisor.username]))
  })

  it("should return a 'not allowed' error if current user is not a supervisor", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.GeneralHandler], visibleForces: ["001"] })

    const result = await fetchUserList(testDatabaseGateway.readonly, user, logger)

    expect(result).toBeInstanceOf(NotAllowedError)
  })
})
