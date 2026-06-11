import type { User } from "@moj-bichard7/common/types/User"

import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import fetchUserById from "./fetchUserById"

const testDatabaseGateway = new End2EndPostgres()

describe("fetchUserById", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("should return user if id is valid and user belongs to a visible force in the current user's visible forces", async () => {
    const currentUser = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
    const requestedUser = await createUser(testDatabaseGateway, { visibleForces: ["01"] })

    const result = (await fetchUserById(testDatabaseGateway.readonly, currentUser, requestedUser.id)) as User

    expect(result.id).toBe(requestedUser.id)
  })

  it("should return error if current user has no visible forces", async () => {
    const currentUser = await createUser(testDatabaseGateway, { visibleForces: [] })
    await createUser(testDatabaseGateway, { visibleForces: ["01"] })

    const result = await fetchUserById(testDatabaseGateway.readonly, currentUser, currentUser.id)

    expect(result).toStrictEqual(new Error(`User with ID "${currentUser.id}" has no visible forces`))
  })

  it("should return error if current user and requested user have no visible forces in common", async () => {
    const currentUser = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
    const requestedUser = await createUser(testDatabaseGateway, { visibleForces: ["02"] })

    const result = await fetchUserById(testDatabaseGateway.readonly, currentUser, requestedUser.id)

    expect(result).toStrictEqual(new Error(`User with ID "${requestedUser.id}" does not exist`))
  })

  it("should return error if requested user id does not exist", async () => {
    const currentUser = await createUser(testDatabaseGateway, { visibleForces: ["01"] })

    const result = await fetchUserById(testDatabaseGateway.readonly, currentUser, 123)

    expect(result).toStrictEqual(new Error('User with ID "123" does not exist'))
  })
})
