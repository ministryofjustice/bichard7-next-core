import type postgres from "postgres"
import filter from "./filterUserHasSameForceAsCaseAndLockedByUser"

const expectedError = async (sql: postgres.Sql, username: string = "") => {
  let err: Error | undefined

  try {
    await filter(sql, username, 0, [])
  } catch (error) {
    err = error as Error
  }

  return err
}

describe("filterUserHasSameForceAsCaseAndLockedByUser", () => {
  it("throws an error if the case isn't found", async () => {
    const sql = jest.fn(async () => []) as unknown as postgres.Sql

    const err = await expectedError(sql)

    expect(err).toBeDefined()
    expect(err?.message).toBe("Case not found")
  })

  it("throws an error if the case isn't locked by the filter user", async () => {
    const sql = jest.fn(async () => [{ locked_by_user: false }]) as unknown as postgres.Sql

    const err = await expectedError(sql, "test_user")

    expect(err).toBeDefined()
    expect(err?.message).toBe("Case not locked to test_user")
  })

  it("throws an error if the case doesn't belong to the same force as the case", async () => {
    const sql = jest.fn(async () => [{ locked_by_user: true, case_in_force: false }]) as unknown as postgres.Sql

    const err = await expectedError(sql, "test_user")

    expect(err).toBeDefined()
    expect(err?.message).toBe("Case not in same force as test_user")
  })
})
