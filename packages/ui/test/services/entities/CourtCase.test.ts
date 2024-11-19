import type { ResolutionStatus } from "types/ResolutionStatus"

import { expect } from "@jest/globals"
import CourtCase from "services/entities/CourtCase"

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
      exceptionLockedByAnotherUser: "are NOT",
      exceptions: "Resolved",
      expectedResult: false,
      triggers: "Resolved",
      triggersLockedByAnotherUser: "are NOT"
    },
    {
      exceptionLockedByAnotherUser: "are NOT",
      exceptions: "Submitted",
      expectedResult: false,
      triggers: "Resolved",
      triggersLockedByAnotherUser: "are NOT"
    },
    {
      exceptionLockedByAnotherUser: "are",
      exceptions: "Unresolved",
      expectedResult: false,
      triggers: "Resolved",
      triggersLockedByAnotherUser: "are NOT"
    },
    {
      exceptionLockedByAnotherUser: "are NOT",
      exceptions: "Submitted",
      expectedResult: false,
      triggers: "Unresolved",
      triggersLockedByAnotherUser: "are"
    },
    {
      exceptionLockedByAnotherUser: "are NOT",
      exceptions: "Unresolved",
      expectedResult: true,
      triggers: "Unresolved",
      triggersLockedByAnotherUser: "are NOT"
    },
    {
      exceptionLockedByAnotherUser: "are",
      exceptions: "Resolved",
      expectedResult: true,
      triggers: "Unresolved",
      triggersLockedByAnotherUser: "are NOT"
    },
    {
      exceptionLockedByAnotherUser: "are NOT",
      exceptions: "Unresolved",
      expectedResult: true,
      triggers: "Resolved",
      triggersLockedByAnotherUser: "are"
    }
  ])(
    "It should return $expectedResult when triggers are $triggers and $triggersLockedByAnotherUser locked by another user and exceptions are $exceptions and $exceptionLockedByAnotherUser locked by another user",
    ({ exceptionLockedByAnotherUser, exceptions, expectedResult, triggers, triggersLockedByAnotherUser }) => {
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
