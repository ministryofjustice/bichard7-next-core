import { isError } from "types/Result"
import storePasswordResetCode from "useCases/storePasswordResetCode"
import Database from "types/Database"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoUsersTable"
import users from "../../testFixtures/database/data/users"
import selectFromTable from "../../testFixtures/database/selectFromTable"

describe("storePasswordResetCode", () => {
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

  it("should store password reset code when user exists", async () => {
    const emailAddress = "bichard01@example.com"
    const expectedPasswordResetCode = "654321"
    await insertIntoTable(users)

    const result = await storePasswordResetCode(connection, emailAddress, expectedPasswordResetCode)
    expect(isError(result)).toBe(false)

    const actualUserList = await selectFromTable("users", "email", emailAddress)
    const actualUser = actualUserList[0]

    expect(actualUser).toBeDefined()
    expect(actualUser.username).toBe("Bichard01")
    expect(actualUser.password_reset_code).toBe(expectedPasswordResetCode)
  })

  it("should not store password reset code when user is deleted", async () => {
    const mappedUsers = users.map((u) => ({
      ...u,
      deleted_at: new Date()
    }))
    await insertIntoTable(mappedUsers)

    const result = await storePasswordResetCode(connection, "bichard01@example.com", "654321")
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })

  it("should not store password reset code when user does not exist", async () => {
    const result = await storePasswordResetCode(connection, "bichard01@example.com", "654321")
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })
})
