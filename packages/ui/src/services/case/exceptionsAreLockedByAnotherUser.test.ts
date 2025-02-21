import type { DisplayFullCourtCase } from "types/display/CourtCases"
import { exceptionsAreLockedByAnotherUser } from "./exceptionsAreLockedByAnotherUser"

describe("exceptionsAreLockedByAnotherUser", () => {
  it("Should be locked by another user when trigger is locked by another user", () => {
    const caseDto = { errorLockedByUsername: "Another username" } as DisplayFullCourtCase
    const result = exceptionsAreLockedByAnotherUser("username", caseDto)

    expect(result).toBe(true)
  })

  it("will return false if it is locked to the same user", () => {
    const caseDto = { errorLockedByUsername: "username" } as DisplayFullCourtCase
    const result = exceptionsAreLockedByAnotherUser("username", caseDto)

    expect(result).toBe(false)
  })

  it("will return false if it isn't locked", () => {
    const caseDto = { errorLockedByUsername: null } as DisplayFullCourtCase
    const result = exceptionsAreLockedByAnotherUser("username", caseDto)

    expect(result).toBe(false)
  })
})
