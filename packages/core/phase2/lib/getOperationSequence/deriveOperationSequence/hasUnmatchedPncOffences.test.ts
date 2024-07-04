import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import hasUnmatchedPncOffences from "./hasUnmatchedPncOffences"

const createAho = (params: {
  hoOffences: { reasonSequence?: string | null; ccr?: string }[]
  hoCourtCaseReference: string
  pncCourtCases?: [{ courtCaseReference: string; offenceSequenceNumbers: number[] }]
  pncQueryExists: boolean
}) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          CourtCaseReferenceNumber: params.hoCourtCaseReference,
          HearingDefendant: {
            Offence: params.hoOffences.map(({ reasonSequence, ccr }) => ({
              CourtCaseReferenceNumber: ccr,
              CriminalProsecutionReference: { OffenceReasonSequence: reasonSequence }
            }))
          }
        }
      }
    },
    PncQuery: params.pncQueryExists
      ? {
          courtCases: params.pncCourtCases?.map(({ courtCaseReference, offenceSequenceNumbers }) => ({
            courtCaseReference,
            offences: offenceSequenceNumbers.map((sequenceNumber) => ({
              offence: {
                sequenceNumber
              }
            }))
          }))
        }
      : undefined
  }) as unknown as AnnotatedHearingOutcome

describe("hasUnmatchedPncOffences", () => {
  it("should return false and use passed court case reference to match offences when passed court case reference has value", () => {
    const aho = createAho({
      hoCourtCaseReference: "123",
      hoOffences: [
        { reasonSequence: "1", ccr: "123" },
        { reasonSequence: "2", ccr: "123" }
      ],
      pncCourtCases: [{ courtCaseReference: "123", offenceSequenceNumbers: [1, 2] }],
      pncQueryExists: true
    })

    const result = hasUnmatchedPncOffences(aho, "123")

    expect(result).toBe(false)
  })

  it("should return false and use case's court case reference to match offences when passed court case reference is not set", () => {
    const aho = createAho({
      hoCourtCaseReference: "123",
      hoOffences: [
        { reasonSequence: "1", ccr: undefined },
        { reasonSequence: "2", ccr: undefined }
      ],
      pncCourtCases: [{ courtCaseReference: "123", offenceSequenceNumbers: [1, 2] }],
      pncQueryExists: true
    })

    const result = hasUnmatchedPncOffences(aho)

    expect(result).toBe(false)
  })

  it("should return true and use case's court case reference to match offences when passed court case reference is not set and doesn't match offences's CCRs", () => {
    const aho = createAho({
      hoCourtCaseReference: "123",
      hoOffences: [
        { reasonSequence: "1", ccr: "123" },
        { reasonSequence: "2", ccr: "123" }
      ],
      pncCourtCases: [{ courtCaseReference: "123", offenceSequenceNumbers: [1, 2] }],
      pncQueryExists: true
    })

    const result = hasUnmatchedPncOffences(aho)

    expect(result).toBe(true)
  })

  it("should return false when only one offence matches", () => {
    const aho = createAho({
      hoCourtCaseReference: "123",
      hoOffences: [
        { reasonSequence: "1", ccr: "456" },
        { reasonSequence: "2", ccr: "123" }
      ],
      pncCourtCases: [{ courtCaseReference: "123", offenceSequenceNumbers: [1, 2] }],
      pncQueryExists: true
    })

    const result = hasUnmatchedPncOffences(aho, "123")

    expect(result).toBe(false)
  })

  it("should return true when AHO offence reason sequence is null and PNC offence sequence number is 0", () => {
    const aho = createAho({
      hoCourtCaseReference: "123",
      hoOffences: [{ reasonSequence: null, ccr: "123" }],
      pncCourtCases: [{ courtCaseReference: "123", offenceSequenceNumbers: [0, 1] }],
      pncQueryExists: true
    })

    const result = hasUnmatchedPncOffences(aho, "123")

    expect(result).toBe(true)
  })

  it("should return true when AHO offence reason sequence is undefined and PNC offence sequence number is 0", () => {
    const aho = createAho({
      hoCourtCaseReference: "123",
      hoOffences: [{ reasonSequence: undefined, ccr: "123" }],
      pncCourtCases: [{ courtCaseReference: "123", offenceSequenceNumbers: [0, 1] }],
      pncQueryExists: true
    })

    const result = hasUnmatchedPncOffences(aho, "123")

    expect(result).toBe(true)
  })

  it("should return true when none of the offences match", () => {
    const aho = createAho({
      hoCourtCaseReference: "123",
      hoOffences: [
        { reasonSequence: "1", ccr: "456" },
        { reasonSequence: "3", ccr: "123" }
      ],
      pncCourtCases: [{ courtCaseReference: "123", offenceSequenceNumbers: [1, 2] }],
      pncQueryExists: true
    })

    const result = hasUnmatchedPncOffences(aho, "123")

    expect(result).toBe(true)
  })

  it("should return true when pncCourtCases is undefined", () => {
    const aho = createAho({
      hoCourtCaseReference: "123",
      hoOffences: [
        { reasonSequence: "1", ccr: "123" },
        { reasonSequence: "2", ccr: "123" }
      ],
      pncCourtCases: undefined,
      pncQueryExists: true
    })

    const result = hasUnmatchedPncOffences(aho, "123")

    expect(result).toBe(true)
  })

  it("should return true when PncQuery is undefined", () => {
    const aho = createAho({
      hoCourtCaseReference: "123",
      hoOffences: [
        { reasonSequence: "1", ccr: "123" },
        { reasonSequence: "2", ccr: "123" }
      ],
      pncCourtCases: [{ courtCaseReference: "123", offenceSequenceNumbers: [1, 2] }],
      pncQueryExists: false
    })

    const result = hasUnmatchedPncOffences(aho, "123")

    expect(result).toBe(true)
  })

  it("should return true when there are no HO offences", () => {
    const aho = createAho({
      hoCourtCaseReference: "123",
      hoOffences: [],
      pncCourtCases: [{ courtCaseReference: "123", offenceSequenceNumbers: [1, 2] }],
      pncQueryExists: true
    })

    const result = hasUnmatchedPncOffences(aho, "123")

    expect(result).toBe(true)
  })
})
