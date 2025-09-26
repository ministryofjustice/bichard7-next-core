import Database from "types/Database"
import { isError } from "types/Result"
import getFailedPasswordAttempts from "useCases/getFailedPasswordAttempts"
import storeVerificationCode from "useCases/storeVerificationCode"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"

describe("StoreVerificationCode", () => {
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

  it("should return error when database returns error", async () => {
    const expectedError = new Error("Error message")
    const database = <Database>(<unknown>{ result: () => {} })

    jest.spyOn(database, "result").mockResolvedValue(expectedError)

    const result = await storeVerificationCode(database, "DummyEmailAddress", "DummyVerificationCode")

    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(expectedError.message)
  })

  it("should return error when user does not exist", async () => {
    const result = await storeVerificationCode(connection, "DummyEmailAddress", "DummyVerificationCode")
    expect(isError(result)).toBe(true)
  })

  it("should return error when verification code is too long", async () => {
    const query = `INSERT INTO br7own.users(
      id, username, email, created_at)
      VALUES (4, 'tmp_user', 'tmp_email@address', NOW())`
    const insertResult = await connection.result(query).catch((error) => error)
    console.log(insertResult)
    expect(isError(insertResult)).toBe(false)

    const result = await storeVerificationCode(connection, "tmp_email@address", "DummyVerificationCode")
    expect(isError(result)).toBe(true)
  })

  it("should update the failed password attempts", async () => {
    const query = `INSERT INTO br7own.users(
      id, username, email, created_at)
      VALUES (4, 'tmp_user', 'tmp_email@address', NOW())`
    const insertResult = await connection.result(query).catch((error) => error)
    console.log(insertResult)
    expect(isError(insertResult)).toBe(false)

    const storeResult = await storeVerificationCode(connection, "tmp_email@address", "123456")
    expect(isError(storeResult)).toBe(false)

    const result = await getFailedPasswordAttempts(connection, "tmp_email@address")
    expect(isError(result)).toBe(false)
    expect(result).toBe(0)
  })
})
