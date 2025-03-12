import type { DisplayFullCourtCase } from "types/display/CourtCases"
import { exceptionsAreLockedByCurrentUser } from "./exceptionsAreLockedByCurrentUser"

describe("exceptionsAreLockedByAnotherUser", () => {
  it("Should be locked by another user when trigger is locked by another user", () => {
    const caseDto = { errorLockedByUsername: "Another username" } as DisplayFullCourtCase
    const result = exceptionsAreLockedByCurrentUser("username", caseDto)

    expect(result).toBe(false)
  })

  it("will return true if it is locked to the same user", () => {
    const caseDto = { errorLockedByUsername: "username" } as DisplayFullCourtCase
    const result = exceptionsAreLockedByCurrentUser("username", caseDto)

    expect(result).toBe(true)
  })

  it("will return false if it isn't locked", () => {
    const caseDto = { errorLockedByUsername: null } as DisplayFullCourtCase
    const result = exceptionsAreLockedByCurrentUser("username", caseDto)

    expect(result).toBe(false)
  })
})
