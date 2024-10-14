import type {
  AnnotatedHearingOutcome,
  Offence,
  Result
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import getAmendmentsByComparison from "./getAmendmentsByComparison"

describe("getAmendmentsByComparison", () => {
  const updatedNextHearingDateValue = "2012-12-13"
  const updatedOrganisationUnitCode = "Updated OU code"
  const updatedAsn = "Updated ASN"
  let aho: AnnotatedHearingOutcome

  beforeEach(() => {
    const OffenceResult = {
      NextHearingDate: "2012-12-12",
      NextResultSourceOrganisation: { OrganisationUnitCode: "originalOUCode" }
    } as Result

    const offence = {
      Result: [structuredClone(OffenceResult), structuredClone(OffenceResult), structuredClone(OffenceResult)]
    } as unknown as Offence

    aho = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              ArrestSummonsNumber: "Original ASN",
              Offence: [structuredClone(offence), structuredClone(offence), structuredClone(offence)]
            }
          }
        }
      }
    } as AnnotatedHearingOutcome
  })

  it("shouldn't return an updated value when the updates message has no amendments", () => {
    const updatedAho = {} as AnnotatedHearingOutcome

    expect(getAmendmentsByComparison(aho, undefined)).toEqual({})
    expect(getAmendmentsByComparison(aho, updatedAho)).toEqual({})
  })

  it("shouldn't return updates when the original and updated aho is the same", () => {
    expect(getAmendmentsByComparison(aho, aho)).toEqual({})
  })

  it("should return the updated nextHearingDate field with the correct indexes", () => {
    const updatedAho = structuredClone(aho)
    updatedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      {} as Offence,
      {
        Result: [
          {
            NextHearingDate: updatedNextHearingDateValue
          } as Result
        ]
      } as Offence
    ]

    expect(getAmendmentsByComparison(aho, updatedAho)).toEqual({
      nextHearingDate: [{ offenceIndex: 1, resultIndex: 0, value: updatedNextHearingDateValue }]
    })
  })

  it("should return the updated NextResultSourceOrganisation field with the correct indexes", () => {
    const updatedAho = structuredClone(aho)
    updatedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      {
        Result: [
          {} as Result,
          {} as Result,
          {
            NextResultSourceOrganisation: { OrganisationUnitCode: updatedOrganisationUnitCode }
          } as Result
        ]
      } as Offence
    ]
    expect(getAmendmentsByComparison(aho, updatedAho)).toEqual({
      nextSourceOrganisation: [{ offenceIndex: 0, resultIndex: 2, value: updatedOrganisationUnitCode }]
    })
  })

  it("should return an updated asn with the correct value", () => {
    const updatedAho = structuredClone(aho)
    updatedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = updatedAsn

    expect(getAmendmentsByComparison(aho, updatedAho)).toEqual({
      asn: updatedAsn
    })
  })

  it("returns updated offenceReasonSequence", () => {
    const updated = structuredClone(aho)
    updated.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0] = {
      CriminalProsecutionReference: {
        OffenceReasonSequence: "1"
      }
    } as Offence

    const result = getAmendmentsByComparison(aho, updated)
    expect(result).toEqual({
      offenceReasonSequence: [
        {
          offenceIndex: 0,
          value: 1
        }
      ]
    })
  })

  it("returns updated offenceReasonSequence when added in court", () => {
    const updated = structuredClone(aho)
    updated.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0] = {
      AddedByTheCourt: true
    } as Offence

    const result = getAmendmentsByComparison(aho, updated)
    expect(result).toEqual({
      offenceReasonSequence: [
        {
          offenceIndex: 0,
          value: 0
        }
      ]
    })
  })

  it("returns the updated courtCaseReferenceNumber", () => {
    const updated = structuredClone(aho)
    updated.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0] = {
      CourtCaseReferenceNumber: "CourtCaseRef"
    } as Offence

    const result = getAmendmentsByComparison(aho, updated)
    expect(result).toEqual({
      offenceCourtCaseReferenceNumber: [
        {
          offenceIndex: 0,
          value: "CourtCaseRef"
        }
      ]
    })
  })

  it("should return multiple updated fields correctly", () => {
    const updatedAho = structuredClone(aho)
    updatedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = updatedAsn
    updatedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      {} as Offence,
      {
        Result: [
          {
            NextHearingDate: updatedNextHearingDateValue,
            NextResultSourceOrganisation: { OrganisationUnitCode: updatedOrganisationUnitCode }
          } as Result
        ]
      } as Offence
    ]

    expect(getAmendmentsByComparison(aho, updatedAho)).toEqual({
      asn: updatedAsn,
      nextHearingDate: [{ offenceIndex: 1, resultIndex: 0, value: updatedNextHearingDateValue }],
      nextSourceOrganisation: [{ offenceIndex: 1, resultIndex: 0, value: updatedOrganisationUnitCode }]
    })
  })
})
