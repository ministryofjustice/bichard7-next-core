import type { Case } from "@moj-bichard7/common/types/Case"

import { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"

import { resolutionStatusFromDb } from "./convertResolutionStatus"

type CaseErrorData = Pick<Case, "errorStatus">
type CaseTriggerData = Pick<Case, "triggerStatus">

describe("resolutionStatusFromDb", () => {
  it("returns Unresolved when errorStatus is null", () => {
    const caseData: CaseErrorData = { errorStatus: null }

    const result = resolutionStatusFromDb(caseData.errorStatus)

    expect(result).toBeNull()
  })

  it("returns Unresolved when errorStatus is 1", () => {
    const caseData: CaseErrorData = { errorStatus: 1 }

    const result = resolutionStatusFromDb(caseData.errorStatus)

    expect(result).toBe(ResolutionStatus.Unresolved)
  })

  it("returns Resolved when errorStatus is 2", () => {
    const caseData: CaseErrorData = { errorStatus: 2 }

    const result = resolutionStatusFromDb(caseData.errorStatus)

    expect(result).toBe(ResolutionStatus.Resolved)
  })

  it("returns Submitted when errorStatus is 3", () => {
    const caseData: CaseErrorData = { errorStatus: 3 }

    const result = resolutionStatusFromDb(caseData.errorStatus)

    expect(result).toBe(ResolutionStatus.Submitted)
  })
})

describe("triggerStatusFromcaseData", () => {
  it("returns Unresolved when errorStatus is null", () => {
    const caseData: CaseTriggerData = { triggerStatus: null }

    const result = resolutionStatusFromDb(caseData.triggerStatus)

    expect(result).toBeNull()
  })

  it("returns Unresolved when errorStatus is 1", () => {
    const caseData: CaseTriggerData = { triggerStatus: 1 }

    const result = resolutionStatusFromDb(caseData.triggerStatus)

    expect(result).toBe(ResolutionStatus.Unresolved)
  })

  it("returns Resolved when errorStatus is 2", () => {
    const caseData: CaseTriggerData = { triggerStatus: 2 }

    const result = resolutionStatusFromDb(caseData.triggerStatus)

    expect(result).toBe(ResolutionStatus.Resolved)
  })

  it("returns Submitted when errorStatus is 3", () => {
    const caseData: CaseTriggerData = { triggerStatus: 3 }

    const result = resolutionStatusFromDb(caseData.triggerStatus)

    expect(result).toBe(ResolutionStatus.Submitted)
  })
})
