import type { Offence } from "../types/AnnotatedHearingOutcome"

import generateAhoFromOffenceList from "../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import getRecordableOffencesForCourtCase from "./getRecordableOffencesForCourtCase"

const offences = [
  {
    CriminalProsecutionReference: {
      OffenceReasonSequence: "001"
    },
    CourtCaseReferenceNumber: 1
  },
  {
    CourtCaseReferenceNumber: 99,
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
    CourtCaseReferenceNumber: 1
  },
  {
    CriminalProsecutionReference: {
      OffenceReasonSequence: "004"
    }
  },
  {
    OffenceCategory: "B7" // Non-recordable
  }
] as unknown as Offence[]

const recordableOffences = offences.filter((o) => o.OffenceCategory !== "B7")

describe("getRecordableOffencesForCourtCase", () => {
  it("should return empty list when there are no offences", () => {
    const aho = generateAhoFromOffenceList([])

    const actualOffences = getRecordableOffencesForCourtCase(aho)

    expect(actualOffences).toHaveLength(0)
  })

  it("should return all recordable offences when CCR is undefined", () => {
    const aho = generateAhoFromOffenceList(offences as unknown as Offence[])

    const actualOffences = getRecordableOffencesForCourtCase(aho)

    expect(actualOffences).toStrictEqual(recordableOffences)
  })

  it("should return recordable offences that has the same CCR", () => {
    const aho = generateAhoFromOffenceList(offences as unknown as Offence[])

    const actualOffences = getRecordableOffencesForCourtCase(aho, 1)

    expect(actualOffences).toStrictEqual([
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "001"
        },
        CourtCaseReferenceNumber: 1
      },
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "003"
        },
        CourtCaseReferenceNumber: 1
      }
    ])
  })
})
