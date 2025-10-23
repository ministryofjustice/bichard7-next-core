import type Database from "types/Database"
import { isError } from "types/Result"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"
import validateUserVerificationCode from "useCases/validateUserVerificationCode"

describe("validateUserVerificationCode", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("users_groups")
    await deleteFromTable("users")
    await deleteFromTable("groups")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return a user when verification code is correct", async () => {
    const query = `INSERT INTO br7own.users(
      id, username, email, created_at, email_verification_code, email_verification_generated)
      VALUES (4, 'tmp_user', 'tmp_email@address', NOW(), '123456', NOW())`
    const insertResult = await connection.result(query).catch((error) => error)
    expect(isError(insertResult)).toBe(false)

    const result = await validateUserVerificationCode(connection, "tmp_email@address", "123456")
    expect(isError(result)).toBe(false)
    expect(result).toHaveProperty("emailAddress", "tmp_email@address")
  })

  it("should return an error when database returns error", async () => {
    const query = `INSERT INTO br7own.users(
      id, username, email, created_at, email_verification_code, email_verification_generated)
      VALUES (4, 'tmp_user', 'tmp_email@address', NOW(), '123456', NOW())`
    const insertResult = await connection.result(query).catch((error) => error)
    expect(isError(insertResult)).toBe(false)

    const expectedError = new Error("Error message")
    const database = <Database>(<unknown>{
      tx: jest.fn()
    })
    const dbSpy = jest.spyOn(database, "tx")
    dbSpy.mockRejectedValue(expectedError)

    const result = await validateUserVerificationCode(database, "tmp_email@address", "123456")

    expect(isError(result)).toBe(true)
    expect(result).toHaveProperty("message", expectedError.message)
    expect(dbSpy).toHaveBeenCalled()
  })

  it("should return error when code is incorrect length without calling the db", async () => {
    const database = <Database>(<unknown>{
      tx: jest.fn()
    })
    const dbSpy = jest.spyOn(database, "tx")

    const result = await validateUserVerificationCode(database, "DummyEmailAddress", "CodeTooLong")

    expect(isError(result)).toBe(true)
    expect(result).toHaveProperty("message", "Invalid Verification Code")
    expect(dbSpy).not.toHaveBeenCalled()
  })

  it("should return error when user does not exist", async () => {
    const result = await validateUserVerificationCode(connection, "DummyEmailAddress", "123456")
    expect(isError(result)).toBe(true)
    expect(result).toHaveProperty("message", "User not found.")
  })

  it("should return an error when verification code is incorrect", async () => {
    const query = `INSERT INTO br7own.users(
      id, username, email, created_at, email_verification_code, email_verification_generated)
      VALUES (4, 'tmp_user', 'tmp_email@address', NOW(), '123456', NOW())`
    const insertResult = await connection.result(query).catch((error) => error)
    expect(isError(insertResult)).toBe(false)

    const result = await validateUserVerificationCode(connection, "tmp_email@address", "111222")
    expect(isError(result)).toBe(true)
    expect(result).toHaveProperty("message", "Invalid Verification Code or Code Expired")
  })

  it("should return an error when verification code is correct but expired", async () => {
    const query = `INSERT INTO br7own.users(
      id, username, email, created_at, email_verification_code, email_verification_generated)
      VALUES (4, 'tmp_user', 'tmp_email@address', NOW(), '123456', NOW() - INTERVAL '$60 minutes')`
    const insertResult = await connection.result(query).catch((error) => error)
    expect(isError(insertResult)).toBe(false)

    const result = await validateUserVerificationCode(connection, "tmp_email@address", "123456")
    expect(isError(result)).toBe(true)
    expect(result).toHaveProperty("message", "Invalid Verification Code or Code Expired")
  })

  it("should return an error when verification code is correct but user has been deleted", async () => {
    const query = `INSERT INTO br7own.users(
      id, username, email, created_at, email_verification_code, email_verification_generated, deleted_at)
      VALUES (4, 'tmp_user', 'tmp_email@address', NOW(), '123456', NOW(), NOW())`
    const insertResult = await connection.result(query).catch((error) => error)
    expect(isError(insertResult)).toBe(false)

    const result = await validateUserVerificationCode(connection, "tmp_email@address", "123456")
    expect(isError(result)).toBe(true)
    expect(result).toHaveProperty("message", "User is deleted")
  })
})
