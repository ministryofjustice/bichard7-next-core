import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import generateAhoFromOffenceList from "../../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import generateAhoMatchingPncAdjudicationAndDisposals from "../../../phase2/tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie from "./getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie"

describe("getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie", () => {
  it("should return undefined when offence reason sequence does not have value", () => {
    const offence = { CriminalProsecutionReference: {}, Result: [] } as unknown as Offence
    const aho = generateAhoFromOffenceList([offence])
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber = undefined

    const result = getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie(aho, offence)

    expect(result).toBeUndefined()
  })

  it("should return undefined when PNC query does not have value", () => {
    const offence = { CriminalProsecutionReference: { OffenceReasonSequence: "001" }, Result: [] } as unknown as Offence
    const aho = generateAhoFromOffenceList([offence])
    aho.PncQuery = undefined
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber = undefined

    const result = getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie(aho, offence)

    expect(result).toBeUndefined()
  })

  it("should return undefined when penalty notice case reference number has value", () => {
    const offence = { CriminalProsecutionReference: { OffenceReasonSequence: "001" }, Result: [] } as unknown as Offence
    const aho = generateAhoFromOffenceList([offence])
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber = "1"

    const result = getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie(aho, offence)

    expect(result).toBeUndefined()
  })

  it("should return undefined when there is no matching PNC adjudication", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({
      hasMatchingPncAdjudication: false,
      hasOffenceReasonSequence: true
    })
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber = undefined
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie(aho, offence)

    expect(result).toBeUndefined()
  })

  it("should return undefined when 'disposals' is undefined", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({
      hasMatchingPncAdjudication: true,
      hasOffenceReasonSequence: true
    })
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber = undefined
    const hoOffence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    aho.PncQuery!.courtCases![0].offences[0].disposals = undefined

    const result = getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie(aho, hoOffence)

    expect(result).toBeUndefined()
  })

  it("should return undefined when there are no disposals", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({
      hasMatchingPncAdjudication: true,
      hasOffenceReasonSequence: true
    })
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber = undefined
    const hoOffence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    aho.PncQuery!.courtCases![0].offences[0].disposals = []

    const result = getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie(aho, hoOffence)

    expect(result).toBeUndefined()
  })

  it("should return undefined when all disposals are not 2007", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({
      hasMatchingPncAdjudication: true,
      hasOffenceReasonSequence: true
    })
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber = undefined
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie(aho, offence)

    expect(result).toBeUndefined()
  })

  it("should return adjudication's sentence date when all disposals are 2007", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({
      hasMatchingPncAdjudication: true,
      hasOffenceReasonSequence: true
    })
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber = undefined
    const hoOffence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    const pncOffence = aho.PncQuery!.courtCases![0].offences[0]
    pncOffence.disposals?.forEach((disposal) => {
      disposal.type = 2007
    })

    const result = getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie(aho, hoOffence)

    expect(result?.toISOString()).toBe("2024-05-22T00:00:00.000Z")
  })
})
