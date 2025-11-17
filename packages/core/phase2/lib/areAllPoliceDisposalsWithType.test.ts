import generateAhoMatchingPncAdjudicationAndDisposals from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import areAllPoliceDisposalsWithType from "./areAllPoliceDisposalsWithType"

describe("areAllPoliceDisposalsWithType", () => {
  it("returns true when all disposals match disposal type, offence CCR is undefined, and AHO CCR has value and matches PNC CCR", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "2"
    aho.PncQuery!.courtCases![0].courtCaseReference = "2"
    aho.PncQuery!.courtCases![0].offences![0].disposals = [{ type: 2007 }, { type: 2007 }]
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    offence.CourtCaseReferenceNumber = undefined

    const result = areAllPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(true)
  })

  it("returns true when all disposals match disposal type, AHO CCR is undefined, and offence CCR has value and matches PNC CCR", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = undefined
    aho.PncQuery!.courtCases![0].courtCaseReference = "2"
    aho.PncQuery!.courtCases![0].offences![0].disposals = [{ type: 2007 }, { type: 2007 }]
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    offence.CourtCaseReferenceNumber = "2"

    const result = areAllPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(true)
  })

  it("returns false when CCR matches but there is a non-matching disposal", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "2"
    aho.PncQuery!.courtCases![0].courtCaseReference = "2"
    aho.PncQuery!.courtCases![0].offences![0].disposals = [{ type: 2007 }, { type: 2068 }]
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = areAllPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(false)
  })

  it("returns false when CCR matches but there are no disposal", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "2"
    aho.PncQuery!.courtCases![0].courtCaseReference = "2"
    aho.PncQuery!.courtCases![0].offences![0].disposals = []
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = areAllPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(false)
  })

  it("returns false when CCR matches but disposal is undefined", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "2"
    aho.PncQuery!.courtCases![0].courtCaseReference = "2"
    aho.PncQuery!.courtCases![0].offences![0].disposals = undefined
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = areAllPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(false)
  })

  it("returns false when CCR matches but PNC court cases are undefined", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "2"
    aho.PncQuery!.courtCases = undefined
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = areAllPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(false)
  })

  it("returns false when CCR matches but PNC query are undefined", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "2"
    aho.PncQuery = undefined
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = areAllPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(false)
  })

  it("returns false when all disposals are 2007 but CCR does not match", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "3"
    aho.PncQuery!.courtCases![0].courtCaseReference = "2"
    aho.PncQuery!.courtCases![0].offences![0].disposals = [{ type: 2007 }, { type: 2007 }]
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = areAllPoliceDisposalsWithType(aho, offence, 2007)

    expect(result).toBe(false)
  })
})
