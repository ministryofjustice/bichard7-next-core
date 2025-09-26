import { isError } from "types/Result"
import getPasswordResetCode from "useCases/getPasswordResetCode"
import storePasswordResetCode from "useCases/storePasswordResetCode"
import Database from "types/Database"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"
import insertIntoTable from "../../testFixtures/database/insertIntoUsersTable"
import users from "../../testFixtures/database/data/users"

describe("getPasswordResetCode", () => {
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

  it("should return password reset code when user exists", async () => {
    const emailAddress = "bichard01@example.com"
    await insertIntoTable(users)

    const expectedPasswordResetCode = "664422"
    await storePasswordResetCode(connection, emailAddress, expectedPasswordResetCode)

    const result = await getPasswordResetCode(connection, emailAddress)

    expect(isError(result)).toBe(false)
    expect(result).toBe(expectedPasswordResetCode)
  })

  it("should return error when user does not exist", async () => {
    const emailAddress = "bichard01@example.com"
    const expectedPasswordResetCode = "664422"
    await storePasswordResetCode(connection, emailAddress, expectedPasswordResetCode)

    const result = await getPasswordResetCode(connection, emailAddress)

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })

  it("should return error when user is deleted", async () => {
    const emailAddress = "bichard01@example.com"
    const mappedUsers = users.map((u) => ({
      ...u,
      deleted_at: new Date()
    }))

    await insertIntoTable(mappedUsers)

    const expectedPasswordResetCode = "664422"
    await storePasswordResetCode(connection, emailAddress, expectedPasswordResetCode)

    const result = await getPasswordResetCode(connection, emailAddress)

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })
})
