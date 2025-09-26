import type User from "types/User"
import { isError } from "types/Result"
import getUserByEmailAddress from "useCases/getUserByEmailAddress"
import type Database from "types/Database"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"
import users from "../../testFixtures/database/data/users"
import insertIntoTable from "../../testFixtures/database/insertIntoUsersTable"

describe("DeleteUserUseCase", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("users")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return user when user exists in the database", async () => {
    const emailAddress = "bichard01@example.com"
    await insertIntoTable(users)
    const user = (await getUserByEmailAddress(connection, emailAddress)) as User

    expect(isError(user)).toBe(false)

    expect(user.id).toBeGreaterThan(0)
    expect(user.emailAddress).toBe(emailAddress)
    expect(user.username).toBe("Bichard01")
    expect(user.endorsedBy).toBe("endorsed_by 01")
    expect(user.orgServes).toBe("org_severs 01")
    expect(user.forenames).toBe("Bichard User 01")
  })

  it("should return null when user does not exist in the database", async () => {
    const user = await getUserByEmailAddress(connection, "InvalidUsername")

    expect(user).toBeNull()
  })

  it("should return null when user is deleted", async () => {
    await insertIntoTable(users)
    const user = await getUserByEmailAddress(connection, "wrongemail@emailaddres.com")

    expect(user).toBeNull()
  })
})
