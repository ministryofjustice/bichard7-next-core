import { expect } from "@jest/globals"
import CourtCase from "../../../src/services/entities/CourtCase"

describe("CourtCase", () => {
  it("should be locked by another user when error is locked by another user", () => {
    const courtCase = new CourtCase()
    courtCase.errorLockedByUsername = "Another username"
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(true)
  })

  it("should be locked by another user when trigger is locked by another user", () => {
    const courtCase = new CourtCase()
    courtCase.triggerLockedByUsername = "Another username"
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(true)
  })

  it("should not be locked by another user when error is locked by the user", () => {
    const courtCase = new CourtCase()
    courtCase.errorLockedByUsername = "username"
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(false)
  })

  it("should not be locked by another user when trigger is locked by the user", () => {
    const courtCase = new CourtCase()
    courtCase.triggerLockedByUsername = "username"
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(false)
  })

  it("should not be locked by another user when error and trigger are not locked by any user", () => {
    const courtCase = new CourtCase()
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(false)
  })
})
