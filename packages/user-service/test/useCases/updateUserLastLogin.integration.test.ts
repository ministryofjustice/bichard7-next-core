import { isError } from "types/Result"
import type Database from "types/Database"
import updateUserLastLogin from "useCases/updateUserLastLogin"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoUsersTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import users from "../../testFixtures/database/data/users"

jest.mock("lib/argon2")

describe("updatePassword", () => {
  let connection: Database

  beforeEach(async () => {
    await deleteFromTable("users")
  })

  beforeAll(() => {
    connection = getTestConnection()
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should update last login when user exists", async () => {
    const userName = "Bichard01"
    await insertIntoTable(users)

    const result = await updateUserLastLogin(connection, userName)
    expect(isError(result)).toBe(false)

    const emailAddress = "bichard01@example.com"
    const actualUserList = await selectFromTable("users", "email", emailAddress)
    const actualUser = actualUserList[0]

    expect(actualUser).toBeDefined()
    expect(actualUser.username).toBe("Bichard01")

    // We should be storing the password hash, not the bare password
    expect(actualUser.last_logged_in - new Date().getTime()).toBeLessThan(100)
  })

  it("should return error when user is deleted", async () => {
    const mappedUsers = users.map((u) => ({
      ...u,
      deleted_at: new Date()
    }))

    await insertIntoTable(mappedUsers)
    const result = await updateUserLastLogin(connection, "bichard01@example.com")
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found.")
  })

  it("should return error when user does not exist", async () => {
    await insertIntoTable(users)
    const result = await updateUserLastLogin(connection, "incorrectusername")
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found.")
  })
})
