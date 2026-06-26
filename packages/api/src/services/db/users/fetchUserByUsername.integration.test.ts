import { type User } from "@moj-bichard7/common/types/User"

import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import fetchUserByUsername from "./fetchUserByUsername"

const testDatabaseGateway = new End2EndPostgres()

describe("users in groups", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("returns an empty group if the user does not belong to any groups", async () => {
    const username = "nogroupsuser"
    await createUser(testDatabaseGateway, { groups: [], username })
    const result = await fetchUserByUsername(testDatabaseGateway.readonly, username)
    const user = result as User
    expect(user.groups).toEqual([])
  })

  it("should return the specified user", async () => {
    const user = await createUser(testDatabaseGateway, { visibleForces: ["01"] })

    const result = (await fetchUserByUsername(testDatabaseGateway.readonly, user.username)) as User

    expect(result.username).toEqual(user.username)
  })

  it("should return an error if the user does not exist", async () => {
    const result = await fetchUserByUsername(testDatabaseGateway.readonly, "non-existent-user")
    expect(result).toBe(new Error('User "non-existent-user" does not exist'))
  })
})
