/**
 * @jest-environment node
 */

import { isError } from "types/Result"
import { changePassword } from "useCases"
import type Database from "types/Database"
import { verifyPassword } from "lib/argon2"
import insertIntoTable from "../../testFixtures/database/insertIntoUsersTable"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"
import users from "../../testFixtures/database/data/users"
import fakeAuditLogger from "../fakeAuditLogger"

describe("changePassword", () => {
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

  it("should change password when current password is correct", async () => {
    await insertIntoTable(users)
    const newPassword = "NewPassword"
    const result = await changePassword(connection, fakeAuditLogger, "bichard01@example.com", "password", newPassword)

    expect(isError(result)).toBe(false)

    const { password: actualPasswordHash } = (await connection.one(
      "SELECT password FROM br7own.users WHERE email=$1",
      "bichard01@example.com"
    )) as { password: string }

    const passwordMatchResult = await verifyPassword(newPassword, actualPasswordHash)

    expect(passwordMatchResult).toBe(true)
  })

  it("should return error when current password is incorrect", async () => {
    await insertIntoTable(users)
    const result = await changePassword(
      connection,
      fakeAuditLogger,
      "bichard01@example.com",
      "IncorrectPassword",
      "NewPassword"
    )

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("Your current password is incorrect.")
  })
})
