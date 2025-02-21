import type { DisplayFullCourtCase } from "types/display/CourtCases"
import { triggersAreLockedByAnotherUser } from "./triggersAreLockedByAnotherUser"

describe("triggersAreLockedByAnotherUser", () => {
  it("Should be locked by another user when trigger is locked by another user", () => {
    const caseDto = { triggerLockedByUsername: "Another username" } as DisplayFullCourtCase
    const result = triggersAreLockedByAnotherUser("username", caseDto)

    expect(result).toBe(true)
  })

  it("will return false if it is locked to the same user", () => {
    const caseDto = { triggerLockedByUsername: "username" } as DisplayFullCourtCase
    const result = triggersAreLockedByAnotherUser("username", caseDto)

    expect(result).toBe(false)
  })

  it("will return false if it isn't locked", () => {
    const caseDto = { triggerLockedByUsername: null } as DisplayFullCourtCase
    const result = triggersAreLockedByAnotherUser("username", caseDto)

    expect(result).toBe(false)
  })
})
