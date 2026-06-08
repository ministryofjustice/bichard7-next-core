import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import filterUsersByVisibleForces from "./filterUsersByVisibleForces"

const testDatabaseGateway = new End2EndPostgres()

describe("filterUsersByVisibleForces", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("should match users with the exact same single force code", async () => {
    const matchingUser = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
    const nonMatchingUser = await createUser(testDatabaseGateway, { visibleForces: ["02"] })

    const whereCondition = filterUsersByVisibleForces(testDatabaseGateway.readonly, ["01"])
    const result = await testDatabaseGateway.filterUsers(whereCondition)

    const usernames = result.map((u) => u.username)
    expect(usernames).toContain(matchingUser.username)
    expect(usernames).not.toContain(nonMatchingUser.username)
  })

  it("should handle leading zeros correctly (e.g., '01' should match '001')", async () => {
    const userWithThreeZeros = await createUser(testDatabaseGateway, { visibleForces: ["001"] })
    const userWithOneZero = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
    const nonMatchingUser = await createUser(testDatabaseGateway, { visibleForces: ["101"] })

    const whereCondition = filterUsersByVisibleForces(testDatabaseGateway.readonly, ["01"])
    const result = await testDatabaseGateway.filterUsers(whereCondition)
    const usernames = result.map((u) => u.username)
    expect(usernames).toContain(userWithThreeZeros.username)
    expect(usernames).toContain(userWithOneZero.username)
    expect(usernames).not.toContain(nonMatchingUser.username)
  })

  it("should match a user if they match any of the multiple provided forces (OR logic)", async () => {
    const userInForce2 = await createUser(testDatabaseGateway, { visibleForces: ["02"] })
    const userInForce3 = await createUser(testDatabaseGateway, { visibleForces: ["03"] })
    const userInForce4 = await createUser(testDatabaseGateway, { visibleForces: ["04"] })

    const whereCondition = filterUsersByVisibleForces(testDatabaseGateway.readonly, ["02", "03"])
    const result = await testDatabaseGateway.filterUsers(whereCondition)

    const usernames = result.map((u) => u.username)
    expect(usernames).toContain(userInForce2.username)
    expect(usernames).toContain(userInForce3.username)
    expect(usernames).not.toContain(userInForce4.username)
  })

  it("should evaluate a complex array of mixed forces successfully", async () => {
    const userWithMultipleForces = await createUser(testDatabaseGateway, { visibleForces: ["01", "02", "05"] })
    const userWithIrrelevantForces = await createUser(testDatabaseGateway, { visibleForces: ["06", "07"] })

    const whereCondition = filterUsersByVisibleForces(testDatabaseGateway.readonly, ["02", "03"])
    const result = await testDatabaseGateway.filterUsers(whereCondition)

    const usernames = result.map((u) => u.username)
    expect(usernames).toContain(userWithMultipleForces.username)
    expect(usernames).not.toContain(userWithIrrelevantForces.username)
  })
})
