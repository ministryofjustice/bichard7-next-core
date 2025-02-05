import type { Offence, Result } from "../../types/AnnotatedHearingOutcome"

import ResultClass from "../../types/ResultClass"
import getAdjustedRecordableOffencesForCourtCase from "./getAdjustedRecordableOffencesForCourtCase"

describe("getAdjustedRecordableOffencesForCourtCase", () => {
  it("should return empty array when there are no offences", () => {
    const actualOffences = getAdjustedRecordableOffencesForCourtCase([])

    expect(actualOffences).toHaveLength(0)
  })

  it("should return empty array when there are no recordable offences", () => {
    const offences = [
      {
        CourtCaseReferenceNumber: "99",
        OffenceCategory: "B7", // Non-recordable
        Result: [] as Result[]
      }
    ] as Offence[]

    const actualOffences = getAdjustedRecordableOffencesForCourtCase(offences)

    expect(actualOffences).toHaveLength(0)
  })

  it("should return empty array when there are no matching recordable offences for the CCR", () => {
    const offences = [
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "001"
        },
        CourtCaseReferenceNumber: "1",
        Result: [] as Result[]
      }
    ] as Offence[]

    const actualOffences = getAdjustedRecordableOffencesForCourtCase(offences, "2")

    expect(actualOffences).toHaveLength(0)
  })

  it("should return the offence when there are no 2060 or 2059 disposals", () => {
    const offences = [
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "001"
        },
        CourtCaseReferenceNumber: "1",
        Result: [
          {
            PNCDisposalType: 2051
          }
        ] as Result[]
      }
    ] as Offence[]

    const actualOffences = getAdjustedRecordableOffencesForCourtCase(offences, "1")

    expect(actualOffences).toStrictEqual([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "001" },
        Result: [{ PNCDisposalType: 2051 }]
      }
    ])
  })

  it("should return the offence when the result disposal is 2059", () => {
    const offences = [
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "001"
        },
        CourtCaseReferenceNumber: "1",
        Result: [
          {
            PNCDisposalType: 2059
          }
        ] as Result[]
      }
    ] as Offence[]

    const actualOffences = getAdjustedRecordableOffencesForCourtCase(offences, "1")

    expect(actualOffences).toStrictEqual([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "001" },
        Result: [{ PNCDisposalType: 2059 }]
      }
    ])
  })

  it("should convert disposal to 2063 when the result disposal is 2060", () => {
    const offences = [
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "001"
        },
        CourtCaseReferenceNumber: "1",
        Result: [
          {
            PNCDisposalType: 2060
          }
        ] as Result[]
      }
    ] as Offence[]

    const actualOffences = getAdjustedRecordableOffencesForCourtCase(offences, "1")

    expect(actualOffences).toStrictEqual([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "001" },
        Result: [{ PNCDisposalType: 2063 }]
      }
    ])
  })

  it("should not convert disposal to 2063 when there is a 2060 disposal but there is also a non 2060/2059 disposal that is not added by the court", () => {
    const offences = [
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "001"
        },
        CourtCaseReferenceNumber: "1",
        Result: [
          {
            PNCDisposalType: 2060
          }
        ] as Result[]
      },
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "002"
        },
        CourtCaseReferenceNumber: "1",
        AddedByTheCourt: false,
        Result: [
          {
            PNCDisposalType: 2051,
            ResultClass: ResultClass.SENTENCE
          }
        ] as Result[]
      }
    ] as Offence[]

    const actualOffences = getAdjustedRecordableOffencesForCourtCase(offences, "1")

    expect(actualOffences).toStrictEqual([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "001" },
        Result: [{ PNCDisposalType: 2060 }]
      },
      {
        AddedByTheCourt: false,
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "002" },
        Result: [{ PNCDisposalType: 2051, ResultClass: ResultClass.SENTENCE }]
      }
    ])
  })

  it("should not convert disposal to 2063 when there is a 2060 disposal but there is a non 2060/2059 disposal that the result class is compatible with disposal", () => {
    const offences = [
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "001"
        },
        CourtCaseReferenceNumber: "1",
        Result: [
          {
            PNCDisposalType: 2060
          }
        ] as Result[]
      },
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "002"
        },
        AddedByTheCourt: true,
        CourtCaseReferenceNumber: "1",
        Result: [
          {
            PNCDisposalType: 2051,
            ResultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT
          }
        ] as Result[]
      }
    ] as Offence[]

    const actualOffences = getAdjustedRecordableOffencesForCourtCase(offences, "1")

    expect(actualOffences).toStrictEqual([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "001" },
        Result: [{ PNCDisposalType: 2060 }]
      },
      {
        AddedByTheCourt: true,
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "002" },
        Result: [{ PNCDisposalType: 2051, ResultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT }]
      }
    ])
  })
})
