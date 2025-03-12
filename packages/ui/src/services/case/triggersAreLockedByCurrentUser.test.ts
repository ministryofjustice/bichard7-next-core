import type { DisplayFullCourtCase } from "types/display/CourtCases"
import { triggersAreLockedByCurrentUser } from "./triggersAreLockedByCurrentUser"

describe("triggersAreLockedByCurrentUser", () => {
  it("Should be locked by another user when trigger is locked by another user", () => {
    const caseDto = { triggerLockedByUsername: "Another username" } as DisplayFullCourtCase
    const result = triggersAreLockedByCurrentUser("username", caseDto)

    expect(result).toBe(false)
  })

  it("will return true if it is locked to the same user", () => {
    const caseDto = { triggerLockedByUsername: "username" } as DisplayFullCourtCase
    const result = triggersAreLockedByCurrentUser("username", caseDto)

    expect(result).toBe(true)
  })

  it("will return false if it isn't locked", () => {
    const caseDto = { triggerLockedByUsername: null } as DisplayFullCourtCase
    const result = triggersAreLockedByCurrentUser("username", caseDto)

    expect(result).toBe(false)
  })
})
