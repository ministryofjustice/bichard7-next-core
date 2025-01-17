import type { Case } from "@moj-bichard7/common/types/Case"

import { ResolutionStatus, resolutionStatusFromDb } from "./convertResolutionStatus"

type CaseErrorData = Pick<Case, "error_status">
type CaseTriggerData = Pick<Case, "trigger_status">

describe("resolutionStatusFromDb", () => {
  it("returns Unresolved when errorStatus is null", () => {
    const caseData: CaseErrorData = { error_status: null }

    const result = resolutionStatusFromDb(caseData.error_status)

    expect(result).toBeNull()
  })

  it("returns Unresolved when errorStatus is 1", () => {
    const caseData: CaseErrorData = { error_status: 1 }

    const result = resolutionStatusFromDb(caseData.error_status)

    expect(result).toBe(ResolutionStatus.Unresolved)
  })

  it("returns Resolved when errorStatus is 2", () => {
    const caseData: CaseErrorData = { error_status: 2 }

    const result = resolutionStatusFromDb(caseData.error_status)

    expect(result).toBe(ResolutionStatus.Resolved)
  })

  it("returns Submitted when errorStatus is 3", () => {
    const caseData: CaseErrorData = { error_status: 3 }

    const result = resolutionStatusFromDb(caseData.error_status)

    expect(result).toBe(ResolutionStatus.Submitted)
  })
})

describe("triggerStatusFromcaseData", () => {
  it("returns Unresolved when errorStatus is null", () => {
    const caseData: CaseTriggerData = { trigger_status: null }

    const result = resolutionStatusFromDb(caseData.trigger_status)

    expect(result).toBeNull()
  })

  it("returns Unresolved when errorStatus is 1", () => {
    const caseData: CaseTriggerData = { trigger_status: 1 }

    const result = resolutionStatusFromDb(caseData.trigger_status)

    expect(result).toBe(ResolutionStatus.Unresolved)
  })

  it("returns Resolved when errorStatus is 2", () => {
    const caseData: CaseTriggerData = { trigger_status: 2 }

    const result = resolutionStatusFromDb(caseData.trigger_status)

    expect(result).toBe(ResolutionStatus.Resolved)
  })

  it("returns Submitted when errorStatus is 3", () => {
    const caseData: CaseTriggerData = { trigger_status: 3 }

    const result = resolutionStatusFromDb(caseData.trigger_status)

    expect(result).toBe(ResolutionStatus.Submitted)
  })
})
