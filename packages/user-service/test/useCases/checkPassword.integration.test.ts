import checkPassword from "useCases/checkPassword"
import type Database from "types/Database"
import insertIntoTable from "../../testFixtures/database/insertIntoUsersTable"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"
import users from "../../testFixtures/database/data/users"

describe("checkPassword", () => {
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

  it("should return true when password is correct", async () => {
    await insertIntoTable(users)
    const result = await checkPassword(connection, "bichard01@example.com", "password")

    expect(result).toBe(true)
  })

  it("should return false when password is incorrect", async () => {
    await insertIntoTable(users)
    const result = await checkPassword(connection, "bichard01@example.com", "IncorrectPassword")

    expect(result).toBe(false)
  })
})
