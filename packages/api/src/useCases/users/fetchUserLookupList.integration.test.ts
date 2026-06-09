import type { UserLookupList } from "@moj-bichard7/common/types/User"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import FakeLogger from "../../tests/helpers/fakeLogger"
import { createUser } from "../../tests/helpers/userHelper"
import End2EndPostgres from "../../tests/testGateways/e2ePostgres"
import { NotAllowedError } from "../../types/errors/NotAllowedError"
import fetchUserLookupList from "./fetchUserLookupList"

const testDatabaseGateway = new End2EndPostgres()

describe("fetchUserLookupList", () => {
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

  it("returns user lookup list if current user is a supervisor", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.GeneralHandler], visibleForces: ["001"] })
    const supervisor = await createUser(testDatabaseGateway, { groups: [UserGroup.Supervisor], visibleForces: ["001"] })

    const userLookupList = (await fetchUserLookupList(
      testDatabaseGateway.readonly,
      supervisor,
      logger
    )) as UserLookupList

    expect(userLookupList).toEqual({
      users: expect.arrayContaining([
        expect.objectContaining({
          fullname: user.forenames + " " + user.surname,
          id: user.id
        }),
        expect.objectContaining({
          fullname: supervisor.forenames + " " + supervisor.surname,
          id: supervisor.id
        })
      ])
    })
  })

  it("returns a 'not allowed' error if current user is not a supervisor", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.GeneralHandler], visibleForces: ["001"] })

    const result = await fetchUserLookupList(testDatabaseGateway.readonly, user, logger)

    expect(result).toBeInstanceOf(NotAllowedError)
  })
})
