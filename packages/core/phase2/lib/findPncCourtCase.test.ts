import generateAhoMatchingPncAdjudicationAndDisposals from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import findPncCourtCase from "./findPncCourtCase"

describe("findPncCourtCase", () => {
  it("should return the PNC court case when PNC court case reference matches HO offence court case reference", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CourtCaseReferenceNumber = "10"
    aho.PncQuery!.courtCases![0].courtCaseReference = "10"

    const pncCase = findPncCourtCase(aho, aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0])

    expect(pncCase).toEqual(aho.PncQuery!.courtCases![0])
  })

  it("should return the PNC court case when PNC court case reference matches HO case court case reference", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CourtCaseReferenceNumber = undefined
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "20"
    aho.PncQuery!.courtCases![0].courtCaseReference = "20"

    const pncCase = findPncCourtCase(aho, aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0])

    expect(pncCase).toEqual(aho.PncQuery!.courtCases![0])
  })

  it("should return undefined when PNC court case reference does not match HO offence court case reference", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CourtCaseReferenceNumber = "20"
    aho.PncQuery!.courtCases![0].courtCaseReference = "10"

    const pncCase = findPncCourtCase(aho, aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0])

    expect(pncCase).toBeUndefined()
  })

  it("should return undefined when PNC court case reference does not match HO case court case reference", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CourtCaseReferenceNumber = undefined
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "20"
    aho.PncQuery!.courtCases![0].courtCaseReference = "10"

    const pncCase = findPncCourtCase(aho, aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0])

    expect(pncCase).toBeUndefined()
  })

  it("should return undefined when there are no PNC court cases", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CourtCaseReferenceNumber = "10"
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "10"
    aho.PncQuery!.courtCases = undefined

    const pncCase = findPncCourtCase(aho, aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0])

    expect(pncCase).toBeUndefined()
  })

  it("should return undefined when PNC query is undefined", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CourtCaseReferenceNumber = "10"
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "10"
    aho.PncQuery = undefined

    const pncCase = findPncCourtCase(aho, aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0])

    expect(pncCase).toBeUndefined()
  })
})
