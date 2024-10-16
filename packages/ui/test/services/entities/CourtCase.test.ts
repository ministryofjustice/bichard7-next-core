import { expect } from "@jest/globals"
import CourtCase from "services/entities/CourtCase"
import type { ResolutionStatus } from "types/ResolutionStatus"

describe("CourtCase", () => {
  it("Should be locked by another user when error is locked by another user", () => {
    const courtCase = new CourtCase()
    courtCase.errorLockedByUsername = "Another username"
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(true)
  })

  it("Should be locked by another user when trigger is locked by another user", () => {
    const courtCase = new CourtCase()
    courtCase.triggerLockedByUsername = "Another username"
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(true)
  })

  it("Should not be locked by another user when error is locked by the user", () => {
    const courtCase = new CourtCase()
    courtCase.errorLockedByUsername = "username"
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(false)
  })

  it("Should not be locked by another user when trigger is locked by the user", () => {
    const courtCase = new CourtCase()
    courtCase.triggerLockedByUsername = "username"
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(false)
  })

  it("Should not be locked by another user when error and trigger are not locked by any user", () => {
    const courtCase = new CourtCase()
    const result = courtCase.isLockedByAnotherUser("username")

    expect(result).toBe(false)
  })

  test.each([
    {
      expectedResult: false,
      triggers: "Resolved",
      exceptions: "Resolved",
      triggersLockedByAnotherUser: "are NOT",
      exceptionLockedByAnotherUser: "are NOT"
    },
    {
      expectedResult: false,
      triggers: "Resolved",
      exceptions: "Submitted",
      triggersLockedByAnotherUser: "are NOT",
      exceptionLockedByAnotherUser: "are NOT"
    },
    {
      expectedResult: false,
      triggers: "Resolved",
      exceptions: "Unresolved",
      triggersLockedByAnotherUser: "are NOT",
      exceptionLockedByAnotherUser: "are"
    },
    {
      expectedResult: false,
      triggers: "Unresolved",
      exceptions: "Submitted",
      triggersLockedByAnotherUser: "are",
      exceptionLockedByAnotherUser: "are NOT"
    },
    {
      expectedResult: true,
      triggers: "Unresolved",
      exceptions: "Unresolved",
      triggersLockedByAnotherUser: "are NOT",
      exceptionLockedByAnotherUser: "are NOT"
    },
    {
      expectedResult: true,
      triggers: "Unresolved",
      exceptions: "Resolved",
      triggersLockedByAnotherUser: "are NOT",
      exceptionLockedByAnotherUser: "are"
    },
    {
      expectedResult: true,
      triggers: "Resolved",
      exceptions: "Unresolved",
      triggersLockedByAnotherUser: "are",
      exceptionLockedByAnotherUser: "are NOT"
    }
  ])(
    "It should return $expectedResult when triggers are $triggers and $triggersLockedByAnotherUser locked by another user and exceptions are $exceptions and $exceptionLockedByAnotherUser locked by another user",
    ({ expectedResult, triggers, exceptions, triggersLockedByAnotherUser, exceptionLockedByAnotherUser }) => {
      const courtCase = new CourtCase()
      courtCase.triggerStatus = triggers as ResolutionStatus
      courtCase.errorStatus = exceptions as ResolutionStatus
      courtCase.triggerLockedByUsername = triggersLockedByAnotherUser === "are" ? "BichardForce02" : ""
      courtCase.errorLockedByUsername = exceptionLockedByAnotherUser === "are" ? "BichardForce02" : ""

      const result = courtCase.canReallocate("BichardForce01")

      expect(result).toBe(expectedResult)
    }
  )
})
