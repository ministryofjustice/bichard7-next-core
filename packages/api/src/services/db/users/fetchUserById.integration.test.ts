import { isError } from "@moj-bichard7/common/types/Result"

import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { NotFoundError } from "../../../types/errors/NotFoundError"
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

    const result = await fetchUserById(testDatabaseGateway.readonly, currentUser, requestedUser.id)

    expect(isError(result)).toBe(false)
    expect(result).toEqual({
      deletedAt: null,
      groups: ["General Handler"],
      id: 2,
      username: "User2",
      visibleCourts: ["AB"],
      visibleForces: ["01"]
    })
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

    expect(result).toStrictEqual(new NotFoundError())
  })

  it("should return error if requested user id does not exist", async () => {
    const currentUser = await createUser(testDatabaseGateway, { visibleForces: ["01"] })

    const result = await fetchUserById(testDatabaseGateway.readonly, currentUser, 123)

    expect(result).toStrictEqual(new NotFoundError())
  })
})
