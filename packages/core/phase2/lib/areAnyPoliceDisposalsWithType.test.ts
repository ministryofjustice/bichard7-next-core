import type { AnnotatedHearingOutcome, Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import areAnyPoliceDisposalsWithType from "./areAnyPoliceDisposalsWithType"

const generateAhoAndOffence = (
  hoCcr: string | undefined,
  hoOffence: { ccr?: string; reasonSequence?: string },
  policeCourtCases: { ccr: string; offences?: { disposalTypes?: number[]; sequenceNumber: number }[] }[],
  policeQueryExists: boolean
) => ({
  aho: {
    Exceptions: [],
    AnnotatedHearingOutcome: { HearingOutcome: { Case: { CourtCaseReferenceNumber: hoCcr } } },
    PncQuery: policeQueryExists
      ? {
          courtCases: policeCourtCases.map((courtCase) => ({
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

describe("areAnyPoliceDisposalsWithType", () => {
  it("returns false when court case references and offence reason sequence are not set, PNC Query does not exist in AHO", () => {
    const { aho, offence } = generateAhoAndOffence(undefined, { ccr: undefined, reasonSequence: undefined }, [], false)

    const result = areAnyPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(false)
  })

  it("returns true when there is a matching police court case using the offence CCR containing a matching disposal type", () => {
    const { aho, offence } = generateAhoAndOffence(
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

    const result = areAnyPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(true)
  })

  it("returns true when there is a matching police court case using the AHO CCR containing a matching disposal type", () => {
    const { aho, offence } = generateAhoAndOffence(
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

    const result = areAnyPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(true)
  })

  it("returns false when there is a matching police court case but no matching disposal type", () => {
    const { aho, offence } = generateAhoAndOffence(
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

    const result = areAnyPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(false)
  })

  it("returns false when there is a matching police court case but disposals is undefined", () => {
    const { aho, offence } = generateAhoAndOffence(
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

    const result = areAnyPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(false)
  })

  it("returns false when there is a matching police court case but no disposals", () => {
    const { aho, offence } = generateAhoAndOffence(
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

    const result = areAnyPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(false)
  })

  it("returns false when there is a matching police court case but no offences", () => {
    const { aho, offence } = generateAhoAndOffence(
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

    const result = areAnyPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(false)
  })

  it("returns false when there is a matching police court case but offences is undefined", () => {
    const { aho, offence } = generateAhoAndOffence(
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

    const result = areAnyPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(false)
  })
})
