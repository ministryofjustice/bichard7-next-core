import type { DisplayFullCourtCase } from "types/display/CourtCases"
import type { ResolutionStatus } from "types/ResolutionStatus"
import { canReallocate } from "./canReallocate"

describe("canReallocate", () => {
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
      const caseDto = {} as DisplayFullCourtCase
      caseDto.triggerStatus = triggers as ResolutionStatus
      caseDto.errorStatus = exceptions as ResolutionStatus
      caseDto.triggerLockedByUsername = triggersLockedByAnotherUser === "are" ? "BichardForce02" : ""
      caseDto.errorLockedByUsername = exceptionLockedByAnotherUser === "are" ? "BichardForce02" : ""

      const result = canReallocate("BichardForce01", caseDto)

      expect(result).toBe(expectedResult)
    }
  )
})
