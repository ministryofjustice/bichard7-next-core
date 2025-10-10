import { isError } from "types/Result"
import updatePassword from "useCases/updatePassword"
import { hashPassword } from "lib/argon2"
import type Database from "types/Database"
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

  it("should update password when user exists", async () => {
    const emailAddress = "bichard01@example.com"
    await insertIntoTable(users)

    const expectedPassword = "ExpectedPassword"
    const expectedPasswordHash = "$shiro1$SHA-256$500000$Foo==$Bar="
    const mockedCreatePassword = hashPassword as jest.MockedFunction<typeof hashPassword>
    mockedCreatePassword.mockResolvedValue(expectedPasswordHash)

    const result = await updatePassword(connection, emailAddress, expectedPassword)
    expect(isError(result)).toBe(false)

    const actualUserList = await selectFromTable("users", "email", emailAddress)
    const actualUser = actualUserList[0]

    expect(actualUser).toBeDefined()
    expect(actualUser.username).toBe("Bichard01")

    // We should be storing the password hash, not the bare password
    expect(actualUser.password).toBe(expectedPasswordHash)
    expect(actualUser.password).not.toBe(expectedPassword)
  })

  it("should return error when user is deleted", async () => {
    const mappedUsers = users.map((u) => ({
      ...u,
      deleted_at: new Date()
    }))

    await insertIntoTable(mappedUsers)

    const expectedPassword = "ExpectedPassword"
    const result = await updatePassword(connection, "bichard01@example.com", expectedPassword)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found.")
  })

  it("should return error when user does not exist", async () => {
    await insertIntoTable(users)
    const expectedPassword = "ExpectedPassword"
    const result = await updatePassword(connection, "incorrectemail@address.com", expectedPassword)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found.")
  })
})
