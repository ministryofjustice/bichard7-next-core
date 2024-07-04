import type { Result } from "../../types/AnnotatedHearingOutcome"
import isRecordableResult from "./isRecordableResult"

describe("isRecodableResult", () => {
  it("should return true when PNC disposal type has value and it is not in stop list", () => {
    const offenceResult = {
      PNCDisposalType: 9999
    } as Result

    const result = isRecordableResult(offenceResult)

    expect(result).toBe(true)
  })

  it("should return false when PNC disposal type has value and it is in stop list", () => {
    const offenceResult = {
      PNCDisposalType: 1000
    } as Result

    const result = isRecordableResult(offenceResult)

    expect(result).toBe(false)
  })

  it("should return false when PNC disposal type does not have value", () => {
    const offenceResult = {
      PNCDisposalType: undefined
    } as Result

    const result = isRecordableResult(offenceResult)

    expect(result).toBe(false)
  })
})
