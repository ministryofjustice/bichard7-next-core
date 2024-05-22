import type { AnnotatedHearingOutcome, Offence } from "../../../types/AnnotatedHearingOutcome"
import areAnyPncResults2007 from "./areAnyPncResults2007"

const createInput = (
  hoCcr: string | undefined,
  hoOffence: { ccr?: string; reasonSequence?: string },
  pncCourtCases: { offences?: { sequenceNumber: number; disposalTypes?: number[] }[]; ccr: string }[],
  pncQueryExists: boolean
) => ({
  aho: {
    Exceptions: [],
    AnnotatedHearingOutcome: { HearingOutcome: { Case: { CourtCaseReferenceNumber: hoCcr } } },
    PncQuery: pncQueryExists
      ? {
          courtCases: pncCourtCases.map((courtCase) => ({
            courtCaseReference: courtCase.ccr,
            offences: courtCase.offences?.map((offence) => ({
              disposals: offence.disposalTypes?.map((type) => ({ type })),
              offence: { sequenceNumber: offence.sequenceNumber }
            }))
          }))
        }
      : undefined
  } as unknown as AnnotatedHearingOutcome,
  offence: {
    CourtCaseReferenceNumber: hoOffence.ccr,
    CriminalProsecutionReference: { OffenceReasonSequence: hoOffence.reasonSequence }
  } as Offence
})

describe("areAnyPncResults2007", () => {
  it("should return false when court case references and offence reason sequence are not set, PNCQuery does not exist in AHO", () => {
    const { aho, offence } = createInput(undefined, { ccr: undefined, reasonSequence: undefined }, [], false)

    const result = areAnyPncResults2007(aho, offence)

    expect(result).toBe(false)
  })

  it("should return true when there is a matching PNC court case containing a 2007 result code", () => {
    const { aho, offence } = createInput(
      "456",
      { ccr: "123", reasonSequence: "1" },
      [
        {
          ccr: "123",
          offences: [{ disposalTypes: [8888, 2007], sequenceNumber: 1 }]
        }
      ],
      true
    )

    const result = areAnyPncResults2007(aho, offence)

    expect(result).toBe(true)
  })

  it("should return true when there is a matching PNC using the case court case reference number", () => {
    const { aho, offence } = createInput(
      "123",
      { ccr: undefined, reasonSequence: "1" },
      [
        {
          ccr: "123",
          offences: [{ disposalTypes: [8888, 2007], sequenceNumber: 1 }]
        }
      ],
      true
    )

    const result = areAnyPncResults2007(aho, offence)

    expect(result).toBe(true)
  })

  it("should return false when there is a matching PNC court case but no 2007 result code", () => {
    const { aho, offence } = createInput(
      "123",
      { ccr: "123", reasonSequence: "1" },
      [
        {
          ccr: "123",
          offences: [{ disposalTypes: [8888, 9999], sequenceNumber: 1 }]
        }
      ],
      true
    )

    const result = areAnyPncResults2007(aho, offence)

    expect(result).toBe(false)
  })

  it("should return false when there is a matching PNC court case but disposals is undefined", () => {
    const { aho, offence } = createInput(
      "123",
      { ccr: "123", reasonSequence: "2" },
      [
        {
          ccr: "123",
          offences: [{ disposalTypes: undefined, sequenceNumber: 1 }]
        }
      ],
      true
    )

    const result = areAnyPncResults2007(aho, offence)

    expect(result).toBe(false)
  })

  it("should return false when there is a matching PNC court case but disposals is empty", () => {
    const { aho, offence } = createInput(
      "123",
      { ccr: "123", reasonSequence: "2" },
      [
        {
          ccr: "123",
          offences: [{ disposalTypes: [], sequenceNumber: 1 }]
        }
      ],
      true
    )

    const result = areAnyPncResults2007(aho, offence)

    expect(result).toBe(false)
  })

  it("should return false when there is a matching PNC court case but offences is empty", () => {
    const { aho, offence } = createInput(
      "123",
      { ccr: "123", reasonSequence: "2" },
      [
        {
          ccr: "123",
          offences: []
        }
      ],
      true
    )

    const result = areAnyPncResults2007(aho, offence)

    expect(result).toBe(false)
  })

  it("should return false when there is a matching PNC court case but offences is undefined", () => {
    const { aho, offence } = createInput(
      "123",
      { ccr: "123", reasonSequence: "2" },
      [
        {
          ccr: "123",
          offences: undefined
        }
      ],
      true
    )

    const result = areAnyPncResults2007(aho, offence)

    expect(result).toBe(false)
  })
})
