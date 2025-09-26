import authenticate from "useCases/authenticate"
import storeVerificationCode from "useCases/storeVerificationCode"
import { isError } from "types/Result"
import config from "lib/config"
import { createSsha } from "lib/ssha"
import { hashPassword } from "lib/argon2"
import Database from "types/Database"
import getFailedPasswordAttempts from "useCases/getFailedPasswordAttempts"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import users from "../../testFixtures/database/data/users"
import insertIntoTable from "../../testFixtures/database/insertIntoUsersTable"
import fakeAuditLogger from "../fakeAuditLogger"
import selectFromTable from "../../testFixtures/database/selectFromTable"

jest.mock("lib/parseFormData")

const correctPassword = "correctPassword"
const invalidPassword = "invalidPassword"

const insertUsers = async (useMigratedPassword = false) => {
  let password: string | null = null
  let migratedPassword: string | null = null

  if (useMigratedPassword) {
    password = await hashPassword(correctPassword)
  } else {
    migratedPassword = createSsha(correctPassword)
  }

  const usersWithPasswords: any[] = users.map((user) => ({
    ...user,
    password,
    migrated_password: migratedPassword
  }))

  await insertIntoTable(usersWithPasswords)
}

describe("Authenticator", () => {
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

  it("should allow the user to authenticate with correct code and password", async () => {
    await insertUsers()
    const verificationCode = "CoDeRs"
    await storeVerificationCode(connection, "bichard01@example.com", verificationCode)

    const result = await authenticate(
      connection,
      fakeAuditLogger,
      "bichard01@example.com",
      correctPassword,
      verificationCode
    )
    expect(isError(result)).toBe(false)
  })

  it("should not allow the user to authenticate with correct code and incorrect password", async () => {
    await insertUsers()
    const emailAddress = "bichard02@example.com"
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    await storeVerificationCode(connection, emailAddress, verificationCode)

    const result = await authenticate(connection, fakeAuditLogger, emailAddress, invalidPassword, verificationCode)
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should allow the user to authenticate with correct code and correct password after inserting incorrect password", async () => {
    await insertUsers()
    const emailAddress = "bichard02@example.com"
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    await storeVerificationCode(connection, emailAddress, verificationCode)
    let attemptsSoFar = await getFailedPasswordAttempts(connection, emailAddress)
    expect(attemptsSoFar).toBe(0)

    const result = await authenticate(connection, fakeAuditLogger, emailAddress, invalidPassword, verificationCode)
    expect(isError(result)).toBe(true)
    attemptsSoFar = await getFailedPasswordAttempts(connection, emailAddress)
    expect(attemptsSoFar).toBe(1)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)

    // 2 second wait between checks
    let isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, correctPassword, verificationCode)
    expect(isError(isAuth)).toBe(true)
    attemptsSoFar = await getFailedPasswordAttempts(connection, emailAddress)
    expect(attemptsSoFar).toBe(1)

    // wait until config.incorrectDelay seconds have passed
    await connection.none(
      `
      UPDATE br7own.users
      SET last_login_attempt = NOW() - INTERVAL '$\{interval\} seconds'
      WHERE LOWER(email) = LOWER($\{email\})`,
      { interval: config.incorrectDelay, email: emailAddress }
    )

    isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, correctPassword, verificationCode)
    expect(isError(isAuth)).toBe(false)
    attemptsSoFar = await getFailedPasswordAttempts(connection, emailAddress)
    expect(attemptsSoFar).toBe(0)
  })

  it("should not allow the user to authenticate with incorrect code and correct password", async () => {
    await insertUsers()
    const emailAddress = "bichard03@example.com"
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    await storeVerificationCode(connection, emailAddress, verificationCode)

    const isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, correctPassword, "SoElSe")
    expect(isError(isAuth)).toBe(true)

    const actualError = <Error>isAuth
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should allow the user to authenticate with correct code and password only once", async () => {
    await insertUsers()
    const emailAddress = "bichard01@example.com"
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    await storeVerificationCode(connection, emailAddress, verificationCode)

    let isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, correctPassword, verificationCode)
    expect(isError(isAuth)).toBe(false)

    // wait until config.incorrectDelay seconds have passed
    await connection.none(
      `
      UPDATE br7own.users
      SET last_login_attempt = NOW() - INTERVAL '$\{interval\} seconds'
      WHERE LOWER(email) = LOWER($\{email\})`,
      { interval: config.incorrectDelay, email: emailAddress }
    )

    // login a second time with same values
    isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, correctPassword, verificationCode)
    expect(isError(isAuth)).toBe(true)

    const actualError = <Error>isAuth
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should not allow user to authenticate after failing password 3 times", async () => {
    await insertUsers()
    const emailAddress = "bichard01@example.com"
    const verificationCode = "CoDeRs"
    const expectedError = new Error("Invalid credentials or invalid verification")
    await storeVerificationCode(connection, emailAddress, verificationCode)

    let attemptsSoFar = await getFailedPasswordAttempts(connection, emailAddress)
    expect(attemptsSoFar).toBe(0)

    // first password attempt
    let isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, invalidPassword, verificationCode)
    expect(isError(isAuth)).toBe(true)
    let actualError = <Error>isAuth
    expect(actualError.message).toBe(expectedError.message)
    attemptsSoFar = await getFailedPasswordAttempts(connection, emailAddress)
    expect(attemptsSoFar).toBe(1)

    // wait until config.incorrectDelay seconds have passed
    await connection.none(
      `
      UPDATE br7own.users
      SET last_login_attempt = NOW() - INTERVAL '$\{interval\} seconds'
      WHERE LOWER(email) = LOWER($\{email\})`,
      { interval: config.incorrectDelay, email: emailAddress }
    )

    // second password attempt
    isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, invalidPassword, verificationCode)
    expect(isError(isAuth)).toBe(true)
    actualError = <Error>isAuth
    expect(actualError.message).toBe(expectedError.message)
    attemptsSoFar = await getFailedPasswordAttempts(connection, emailAddress)
    expect(attemptsSoFar).toBe(2)

    // wait until config.incorrectDelay seconds have passed
    await connection.none(
      `
      UPDATE br7own.users
      SET last_login_attempt = NOW() - INTERVAL '$\{interval\} seconds'
      WHERE LOWER(email) = LOWER($\{email\})`,
      { interval: config.incorrectDelay, email: emailAddress }
    )

    // third password attempt
    isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, invalidPassword, verificationCode)
    expect(isError(isAuth)).toBe(true)
    actualError = <Error>isAuth
    expect(actualError.message).toBe(expectedError.message)
    attemptsSoFar = await getFailedPasswordAttempts(connection, emailAddress)
    expect(attemptsSoFar).toBe(3)

    // wait until config.incorrectDelay seconds have passed
    await connection.none(
      `
      UPDATE br7own.users
      SET last_login_attempt = NOW() - INTERVAL '$\{interval\} seconds'
      WHERE LOWER(email) = LOWER($\{email\})`,
      { interval: config.incorrectDelay, email: emailAddress }
    )

    // attempt to use correct password
    isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, correctPassword, verificationCode)
    expect(isError(isAuth)).toBe(true)
    actualError = <Error>isAuth
    expect(actualError.message).toBe(expectedError.message)
    attemptsSoFar = await getFailedPasswordAttempts(connection, emailAddress)
    expect(attemptsSoFar).toBe(3)
  })

  it("should not allow the user to authenticate if their account is soft deleted", async () => {
    const emailAddress = "deleted@example.com"
    const expectedError = new Error("User not found")

    const isAuth = await authenticate(connection, fakeAuditLogger, emailAddress, correctPassword, "")
    expect(isError(isAuth)).toBe(true)

    const actualError = <Error>isAuth
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should allow the user to authenticate and migrate password when migrated user is authenticated", async () => {
    await insertUsers(true)
    const verificationCode = "CoDeRs"
    await storeVerificationCode(connection, "bichard01@example.com", verificationCode)

    const result = await authenticate(
      connection,
      fakeAuditLogger,
      "bichard01@example.com",
      correctPassword,
      verificationCode
    )

    expect(isError(result)).toBe(false)

    const selectedUser = await selectFromTable("users", "email", "bichard01@example.com", undefined)

    expect(selectedUser).toHaveLength(1)
    expect(selectedUser[0].password).toBeDefined()
  })

  it("should return an error if the user doesn't exist", async () => {
    const result = await authenticate(connection, fakeAuditLogger, "baduser@example.com", correctPassword, "123456")

    expect(isError(result)).toBe(true)
    expect(result).toEqual(new Error("User not found"))
  })
})
