import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import TRPR0010 from "./TRPR0010"
const generateMockAho = (hearingDefendent: {
  remandStatus: string
  bailConditions?: string[]
  offences: {
    results: {
      cJSresultCode: number
      resultQualifierVariable: string
    }[]
  }[]
}): AnnotatedHearingOutcome => {
  const offences: Offence[] = hearingDefendent.offences.map(
    (offence) =>
      ({
        Result: offence.results.map((result) => ({
          CJSresultCode: result.cJSresultCode,
          ResultQualifierVariable: [{ Code: result.resultQualifierVariable }]
        }))
      }) as Offence
  )

  const hearingOutcome = {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            Offence: offences,
            BailConditions: hearingDefendent.bailConditions,
            RemandStatus: hearingDefendent.remandStatus
          }
        }
      }
    },
    Exceptions: []
  } as unknown as AnnotatedHearingOutcome
  return hearingOutcome
}

describe("TRPR0010", () => {
  it("should return a trigger if defendantInCustody is false and hasBailConditions is true", () => {
    const mockAho = generateMockAho({
      remandStatus: "LA",
      bailConditions: [""],
      offences: [{ results: [{ cJSresultCode: 0, resultQualifierVariable: "AB" }] }]
    })
    expect(TRPR0010(mockAho)).toEqual([{ code: "TRPR0010" }])
  })
  it("should return a trigger if defendantInCustody is false and hasMatchingOffence is true as resultCode is 4591", () => {
    const mockAho = generateMockAho({
      remandStatus: "LA",
      bailConditions: [],
      offences: [{ results: [{ cJSresultCode: 4597, resultQualifierVariable: "AB" }] }]
    })
    expect(TRPR0010(mockAho)).toEqual([{ code: "TRPR0010" }])
  })
  it("should return a trigger if defendantInCustody is false and hasMatchingOffence is true as resultQualifier is LI", () => {
    const mockAho = generateMockAho({
      remandStatus: "LA",
      bailConditions: [],
      offences: [{ results: [{ cJSresultCode: 0, resultQualifierVariable: "LI" }] }]
    })
    expect(TRPR0010(mockAho)).toEqual([{ code: "TRPR0010" }])
  })
  it("should return a single trigger if all conditions are satisfied", () => {
    const mockAho = generateMockAho({
      remandStatus: "LA",
      bailConditions: [""],
      offences: [{ results: [{ cJSresultCode: 4597, resultQualifierVariable: "LI" }] }]
    })
    expect(TRPR0010(mockAho)).toEqual([{ code: "TRPR0010" }])
    expect(TRPR0010(mockAho)).toHaveLength(1)
  })
  it("should not return a trigger if defendantInCustody is true", () => {
    const mockAho = generateMockAho({
      remandStatus: "PB",
      bailConditions: [""],
      offences: [{ results: [{ cJSresultCode: 4597, resultQualifierVariable: "LI" }] }]
    })
    expect(TRPR0010(mockAho)).toEqual([])
  })
  it("should not return a trigger if defendantInCustody is false, but hasBailConditions and hasMatchingOffence are both false", () => {
    const mockAho = generateMockAho({
      remandStatus: "LA",
      bailConditions: [],
      offences: [{ results: [{ cJSresultCode: 0, resultQualifierVariable: "AB" }] }]
    })
    expect(TRPR0010(mockAho)).toEqual([])
  })
  it("should return a single trigger if defendantInCustody is false, and multiple results satify the conditions", () => {
    const mockAho = generateMockAho({
      remandStatus: "LA",
      bailConditions: [],
      offences: [
        {
          results: [
            { cJSresultCode: 4597, resultQualifierVariable: "AB" },
            { cJSresultCode: 0, resultQualifierVariable: "LI" }
          ]
        }
      ]
    })
    expect(TRPR0010(mockAho)).toEqual([{ code: "TRPR0010" }])
  })
  it("should return a single trigger if defendantInCustody is false, and multiple offences satisfy the conditions", () => {
    const mockAho = generateMockAho({
      remandStatus: "LA",
      bailConditions: [],
      offences: [
        {
          results: [
            { cJSresultCode: 4597, resultQualifierVariable: "LI" },
            { cJSresultCode: 0, resultQualifierVariable: "LI" }
          ]
        },
        {
          results: [
            { cJSresultCode: 4597, resultQualifierVariable: "AB" },
            { cJSresultCode: 0, resultQualifierVariable: "LI" }
          ]
        }
      ]
    })
    expect(TRPR0010(mockAho)).toEqual([{ code: "TRPR0010" }])
  })
})
