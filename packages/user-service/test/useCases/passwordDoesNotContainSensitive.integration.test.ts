import type Database from "types/Database"
import passwordDoesNotContainSensitive from "useCases/passwordDoesNotContainSensitive"
import { isError } from "types/Result"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"
import users from "../../testFixtures/database/data/users"

describe("passwordDoesNotContainSensitive", () => {
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

  it("should return error if contains user details", async () => {
    await insertIntoUsersTable(users)
    let result = await passwordDoesNotContainSensitive(connection, "bichard01", "bichard01@example.com")
    expect(isError(result)).toBe(true)

    result = await passwordDoesNotContainSensitive(connection, "Bichard01", "bichard01@example.com")
    expect(isError(result)).toBe(true)

    result = await passwordDoesNotContainSensitive(connection, "Surname", "bichard01@example.com")
    expect(isError(result)).toBe(true)

    result = await passwordDoesNotContainSensitive(connection, "Bichard", "bichard01@example.com")
    expect(isError(result)).toBe(true)

    result = await passwordDoesNotContainSensitive(connection, "User", "bichard01@example.com")
    expect(isError(result)).toBe(true)
  })

  it("should return undefined if it is fine", async () => {
    await insertIntoUsersTable(users)
    const result = await passwordDoesNotContainSensitive(connection, "ValidPassword", "bichard01@example.com")
    expect(result).toBeUndefined()
  })
})
