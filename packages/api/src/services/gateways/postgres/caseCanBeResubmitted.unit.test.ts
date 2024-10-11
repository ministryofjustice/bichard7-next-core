import type postgres from "postgres"
import type { CaseCanBeResubmittedResult } from "./caseCanBeResubmitted"
import filter from "./caseCanBeResubmitted"

describe("caseCanBeResubmitted", () => {
  it("throws an error if the case isn't found", async () => {
    const sql = jest.fn(() => []) as unknown as postgres.Sql

    let err: Error | undefined
    try {
      await filter(sql, "username", 0, [])
    } catch (error) {
      err = error as Error
    }

    expect(err).toBeDefined()
    expect(err?.message).toBe("Case not found")
  })

  it("returns false if case isn't locked by given user", async () => {
    const sql = jest.fn(() => [
      { locked_by_user: false, case_in_force: true, case_is_unresolved: false } satisfies CaseCanBeResubmittedResult
    ]) as unknown as postgres.Sql

    const lockedByUser = await filter(sql, "username", 0, [])

    expect(lockedByUser).toBe(false)
  })

  it("throws an error if the case doesn't belong to the same force as the case", async () => {
    const sql = jest.fn(() => [
      { locked_by_user: true, case_in_force: false, case_is_unresolved: false } satisfies CaseCanBeResubmittedResult
    ]) as unknown as postgres.Sql

    const caseInForce = await filter(sql, "username", 0, [])

    expect(caseInForce).toBe(false)
  })

  it("returns false if user is locked to the case and case belongs to user's force", async () => {
    const sql = jest.fn(() => [
      { locked_by_user: true, case_in_force: true, case_is_unresolved: false } satisfies CaseCanBeResubmittedResult
    ]) as unknown as postgres.Sql

    const result = await filter(sql, "username", 0, [])

    expect(result).toBe(false)
  })

  it("returns true if user is locked to the case, case belongs to user's force and case is unresolved", async () => {
    const sql = jest.fn(() => [
      { locked_by_user: true, case_in_force: true, case_is_unresolved: true } satisfies CaseCanBeResubmittedResult
    ]) as unknown as postgres.Sql

    const result = await filter(sql, "username", 0, [])

    expect(result).toBe(true)
  })
})
