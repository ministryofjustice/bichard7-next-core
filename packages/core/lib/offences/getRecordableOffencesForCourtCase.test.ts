import type { Offence } from "../../types/AnnotatedHearingOutcome"

import getRecordableOffencesForCourtCase from "./getRecordableOffencesForCourtCase"

const offences = [
  {
    CriminalProsecutionReference: {
      OffenceReasonSequence: "001"
    },
    CourtCaseReferenceNumber: "1"
  },
  {
    CourtCaseReferenceNumber: "99",
    OffenceCategory: "B7" // Non-recordable
  },
  {
    CriminalProsecutionReference: {
      OffenceReasonSequence: "002"
    }
  },
  {
    CriminalProsecutionReference: {
      OffenceReasonSequence: "003"
    },
    CourtCaseReferenceNumber: "1"
  },
  {
    CriminalProsecutionReference: {
      OffenceReasonSequence: "004"
    }
  },
  {
    CriminalProsecutionReference: {
      OffenceReasonSequence: "005"
    },
    CourtCaseReferenceNumber: "2"
  },
  {
    OffenceCategory: "B7" // Non-recordable
  }
] as unknown as Offence[]

describe("getRecordableOffencesForCourtCase", () => {
  it("should return empty list when there are no offences", () => {
    const actualOffences = getRecordableOffencesForCourtCase([])

    expect(actualOffences).toHaveLength(0)
  })

  it("should return recordable offences without CCR when passed CCR is undefined", () => {
    const actualOffences = getRecordableOffencesForCourtCase(offences)

    expect(actualOffences).toStrictEqual([
      { CriminalProsecutionReference: { OffenceReasonSequence: "002" } },
      { CriminalProsecutionReference: { OffenceReasonSequence: "004" } }
    ])
  })

  it("should return recordable offences that has the same CCR", () => {
    const actualOffences = getRecordableOffencesForCourtCase(offences, "1")

    expect(actualOffences).toStrictEqual([
      {
        CriminalProsecutionReference: { OffenceReasonSequence: "001" },
        CourtCaseReferenceNumber: "1"
      },
      { CriminalProsecutionReference: { OffenceReasonSequence: "002" } },
      {
        CriminalProsecutionReference: { OffenceReasonSequence: "003" },
        CourtCaseReferenceNumber: "1"
      },
      { CriminalProsecutionReference: { OffenceReasonSequence: "004" } }
    ])
  })
})
