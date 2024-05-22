import type { Offence } from "../types/AnnotatedHearingOutcome"
import isRecordableOffence from "./isRecordableOffence"

describe("isRecordableOffence", () => {
  it("should return true when offence reason sequence exists and offence category is not in stop list", () => {
    const offence = {
      CriminalProsecutionReference: {
        OffenceReasonSequence: "1"
      },
      OffenceCategory: "ZZ"
    } as Offence

    const result = isRecordableOffence(offence)

    expect(result).toBe(true)
  })

  it("should return true when offence reason sequence exists and offence category is in stop list", () => {
    const offence = {
      CriminalProsecutionReference: {
        OffenceReasonSequence: "1"
      },
      OffenceCategory: "B7"
    } as Offence

    const result = isRecordableOffence(offence)

    expect(result).toBe(true)
  })

  it("should return true when offence reason sequence does not exist and offence category is not in stop list", () => {
    const offence = {
      CriminalProsecutionReference: {
        OffenceReasonSequence: undefined
      },
      OffenceCategory: "ZZ"
    } as Offence

    const result = isRecordableOffence(offence)

    expect(result).toBe(true)
  })

  it("should return true when offence reason sequence does not exist and offence category does not exist", () => {
    const offence = {
      CriminalProsecutionReference: {
        OffenceReasonSequence: undefined
      },
      OffenceCategory: undefined
    } as Offence

    const result = isRecordableOffence(offence)

    expect(result).toBe(true)
  })

  it("should return false when offence reason sequence does not exist and offence category is in stop list", () => {
    const offence = {
      CriminalProsecutionReference: {
        OffenceReasonSequence: undefined
      },
      OffenceCategory: "B7"
    } as Offence

    const result = isRecordableOffence(offence)

    expect(result).toBe(false)
  })
})
