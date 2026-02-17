import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { FetchUsersResult } from "./fetchUsers"

import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import fetchUsers from "./fetchUsers"

const testDatabaseGateway = new End2EndPostgres()

describe("fetchUsers", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("should return supervised users in same force", async () => {
    const user = await createUser(testDatabaseGateway)
    const supervisor = await createUser(testDatabaseGateway, { groups: [UserGroup.Supervisor] })

    const userList = (await fetchUsers(testDatabaseGateway.readonly, supervisor)) as FetchUsersResult

    expect(userList.users.map((u) => u.username)).toEqual(expect.arrayContaining([user.username]))
  })

  it("should return supervised users with more than one visible force", async () => {
    const nonVisibleUser = await createUser(testDatabaseGateway, { visibleForces: ["001", "002"] })
    const visibleUser1 = await createUser(testDatabaseGateway, { visibleForces: ["002", "003"] })
    const visibleUser2 = await createUser(testDatabaseGateway, { visibleForces: ["003", "004"] })
    const visibleUser3 = await createUser(testDatabaseGateway, { visibleForces: ["004", "005"] })
    const supervisor = await createUser(testDatabaseGateway, {
      groups: [UserGroup.Supervisor],
      visibleForces: ["003", "004"]
    })

    const userList = (await fetchUsers(testDatabaseGateway.readonly, supervisor)) as FetchUsersResult

    expect(userList.users.map((u) => u.username)).toEqual(expect.arrayContaining([visibleUser1.username]))
    expect(userList.users.map((u) => u.username)).toEqual(expect.arrayContaining([visibleUser2.username]))
    expect(userList.users.map((u) => u.username)).toEqual(expect.arrayContaining([visibleUser3.username]))
    expect(userList.users.map((u) => u.username)).toEqual(expect.not.arrayContaining([nonVisibleUser.username]))
  })
})
