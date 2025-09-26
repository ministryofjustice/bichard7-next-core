/**
 * @jest-environment node
 */

import { isError } from "types/Result"
import { resetPassword } from "useCases"
import type { ResetPasswordOptions } from "useCases/resetPassword"
import { hashPassword, verifyPassword } from "lib/argon2"
import type Database from "types/Database"
import storeVerificationCode from "useCases/storeVerificationCode"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoUsersTable"
import users from "../../testFixtures/database/data/users"
import fakeAuditLogger from "../fakeAuditLogger"

jest.mock("lib/argon2")

describe("resetPassword", () => {
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

  it("should reset password when email validation code is valid", async () => {
    const emailAddress = "bichard01@example.com"
    await insertIntoTable(users)

    const passwordResetCode = "664422"
    await storeVerificationCode(connection, emailAddress, passwordResetCode)

    const expectedPassword = "ExpectedPassword"
    const expectedPasswordHash = "Dummy password hash"
    const mockedHashPassword = hashPassword as jest.MockedFunction<typeof hashPassword>
    mockedHashPassword.mockResolvedValue(expectedPasswordHash)

    const mockedVerifyPassword = verifyPassword as jest.MockedFunction<typeof verifyPassword>
    mockedVerifyPassword.mockResolvedValue(false)

    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress,
      newPassword: "CreateNewPasswordMocked",
      passwordResetCode
    }
    const result = await resetPassword(connection, fakeAuditLogger, resetPasswordOptions)

    expect(isError(result)).toBe(false)
    expect(result).toBeUndefined()

    const actualUser = await connection.oneOrNone(
      "SELECT username, password FROM br7own.users WHERE LOWER(email) = LOWER($\{email\})",
      {
        email: emailAddress
      }
    )

    expect(actualUser).toBeDefined()
    expect(actualUser.username).toBe("Bichard01")
    expect(actualUser.password).toBe(expectedPasswordHash)
    expect(actualUser.password).not.toBe(expectedPassword)
  })

  it("should return error when new password was used before", async () => {
    const emailAddress = "bichard01@example.com"
    await insertIntoTable(users)

    const passwordResetCode = "664422"
    await storeVerificationCode(connection, emailAddress, passwordResetCode)

    const expectedPasswordHash = "SecondTester"
    const mockedHashPassword = hashPassword as jest.MockedFunction<typeof hashPassword>
    mockedHashPassword.mockResolvedValue(expectedPasswordHash)

    const mockedVerifyPassword = verifyPassword as jest.MockedFunction<typeof verifyPassword>
    mockedVerifyPassword.mockResolvedValue(true)

    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress,
      newPassword: "CreatePasswordMocked",
      passwordResetCode
    }

    const resetResult = await resetPassword(connection, fakeAuditLogger, resetPasswordOptions)
    expect(isError(resetResult)).toBe(false)
    expect(resetResult).toBeDefined()
    expect(resetResult).toBe("Cannot use previously used password.")
  })

  it("should return error when new password is not allowed", async () => {
    const emailAddress = "bichard01@example.com"
    await insertIntoTable(users)

    const passwordResetCode = "664422"
    await storeVerificationCode(connection, emailAddress, passwordResetCode)

    const mockedVerifyPassword = verifyPassword as jest.MockedFunction<typeof verifyPassword>
    mockedVerifyPassword.mockResolvedValue(true)

    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress,
      newPassword: "password",
      passwordResetCode
    }

    const resetResult = await resetPassword(connection, fakeAuditLogger, resetPasswordOptions)
    expect(isError(resetResult)).toBe(false)
    expect(resetResult).toBeDefined()
    expect(resetResult).toBe("Password is too easy to guess.")
  })

  it("should return error when password reset code is not valid", async () => {
    const emailAddress = "bichard01@example.com"
    await insertIntoTable(users)

    await storeVerificationCode(connection, emailAddress, "664422")

    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress,
      newPassword: "DummyPassword",
      passwordResetCode: "112233"
    }
    const result = await resetPassword(connection, fakeAuditLogger, resetPasswordOptions)

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("Password reset code does not match")
  })

  it("should return error when user does not exist", async () => {
    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress: "InvalidEmailAddress",
      newPassword: "DummyPassword",
      passwordResetCode: "DummyCode"
    }
    const result = await resetPassword(connection, fakeAuditLogger, resetPasswordOptions)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })

  it("should return error when user is deleted", async () => {
    const deletedUsers = users.map((user) => ({
      ...user,
      deleted_at: new Date()
    }))

    await insertIntoTable(deletedUsers)

    const resetPasswordOptions: ResetPasswordOptions = {
      emailAddress: "@example.com",
      newPassword: "DummyPassword",
      passwordResetCode: "DummyCode"
    }
    const result = await resetPassword(connection, fakeAuditLogger, resetPasswordOptions)

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("User not found")
  })
})
