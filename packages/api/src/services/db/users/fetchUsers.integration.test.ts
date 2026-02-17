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
    const user = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
    const supervisor = await createUser(testDatabaseGateway, { groups: [UserGroup.Supervisor], visibleForces: ["01"] })

    const userList = (await fetchUsers(testDatabaseGateway.readonly, supervisor)) as FetchUsersResult

    expect(userList.users.map((u) => u.username)).toEqual(expect.arrayContaining([user.username]))
  })

  it("should return supervised users in multiple forces", async () => {
    const nonVisibleUser = await createUser(testDatabaseGateway, { visibleForces: ["01", "02"] })
    const visibleUser1 = await createUser(testDatabaseGateway, { visibleForces: ["02", "03"] })
    const visibleUser2 = await createUser(testDatabaseGateway, { visibleForces: ["03", "04"] })
    const visibleUser3 = await createUser(testDatabaseGateway, { visibleForces: ["04", "05", "06", "07"] })
    const supervisor = await createUser(testDatabaseGateway, {
      groups: [UserGroup.Supervisor],
      visibleForces: ["03", "04"]
    })

    const userList = (await fetchUsers(testDatabaseGateway.readonly, supervisor)) as FetchUsersResult

    expect(userList.users.map((u) => u.username)).toEqual(expect.arrayContaining([visibleUser1.username]))
    expect(userList.users.map((u) => u.username)).toEqual(expect.arrayContaining([visibleUser2.username]))
    expect(userList.users.map((u) => u.username)).toEqual(expect.arrayContaining([visibleUser3.username]))
    expect(userList.users.map((u) => u.username)).toEqual(expect.not.arrayContaining([nonVisibleUser.username]))
  })
})
