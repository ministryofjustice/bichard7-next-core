import type { PartialCaseRow } from "@moj-bichard7/common/types/Case"

import { ResolutionStatus, resolutionStatusFromDb } from "./resolutionStatusFromCaseDB"

describe("resolutionStatusFromDb", () => {
  it("returns Unresolved when errorStatus is null", () => {
    const caseDb = { error_status: null } as unknown as PartialCaseRow

    const result = resolutionStatusFromDb(caseDb.error_status)

    expect(result).toBeNull()
  })

  it("returns Unresolved when errorStatus is 1", () => {
    const caseDb = { error_status: 1 } as unknown as PartialCaseRow

    const result = resolutionStatusFromDb(caseDb.error_status)

    expect(result).toBe(ResolutionStatus.Unresolved)
  })

  it("returns Resolved when errorStatus is 2", () => {
    const caseDb = { error_status: 2 } as unknown as PartialCaseRow

    const result = resolutionStatusFromDb(caseDb.error_status)

    expect(result).toBe(ResolutionStatus.Resolved)
  })

  it("returns Submitted when errorStatus is 3", () => {
    const caseDb = { error_status: 3 } as unknown as PartialCaseRow

    const result = resolutionStatusFromDb(caseDb.error_status)

    expect(result).toBe(ResolutionStatus.Submitted)
  })
})

describe("triggerStatusFromCaseDB", () => {
  it("returns Unresolved when errorStatus is null", () => {
    const caseDb = { trigger_status: null } as unknown as PartialCaseRow

    const result = resolutionStatusFromDb(caseDb.trigger_status)

    expect(result).toBeNull()
  })

  it("returns Unresolved when errorStatus is 1", () => {
    const caseDb = { trigger_status: 1 } as unknown as PartialCaseRow

    const result = resolutionStatusFromDb(caseDb.trigger_status)

    expect(result).toBe(ResolutionStatus.Unresolved)
  })

  it("returns Resolved when errorStatus is 2", () => {
    const caseDb = { trigger_status: 2 } as unknown as PartialCaseRow

    const result = resolutionStatusFromDb(caseDb.trigger_status)

    expect(result).toBe(ResolutionStatus.Resolved)
  })

  it("returns Submitted when errorStatus is 3", () => {
    const caseDb = { trigger_status: 3 } as unknown as PartialCaseRow

    const result = resolutionStatusFromDb(caseDb.trigger_status)

    expect(result).toBe(ResolutionStatus.Submitted)
  })
})
