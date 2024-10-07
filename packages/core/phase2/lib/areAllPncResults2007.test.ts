import generateAhoMatchingPncAdjudicationAndDisposals from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import areAllPncResults2007 from "./areAllPncResults2007"

describe("areAllPncResults2007", () => {
  it("should return true when all PNC disposals are 2007, CCR argument is undefined, and AHO CCR has value and matches PNC CCR", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "2"
    aho.PncQuery!.courtCases![0].courtCaseReference = "2"
    aho.PncQuery!.courtCases![0].offences![0].disposals = [{ type: 2007 }, { type: 2007 }]

    const result = areAllPncResults2007(aho)

    expect(result).toBe(true)
  })

  it("should return true when all PNC disposals are 2007, AHO CCR is undefined, and CCR argument has value and matches PNC CCR", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = undefined
    aho.PncQuery!.courtCases![0].courtCaseReference = "2"
    aho.PncQuery!.courtCases![0].offences![0].disposals = [{ type: 2007 }, { type: 2007 }]

    const result = areAllPncResults2007(aho, "2")

    expect(result).toBe(true)
  })

  it("should return false when CCR matches but there is a non-2007 PNC disposal", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "2"
    aho.PncQuery!.courtCases![0].courtCaseReference = "2"
    aho.PncQuery!.courtCases![0].offences![0].disposals = [{ type: 2007 }, { type: 2068 }]

    const result = areAllPncResults2007(aho)

    expect(result).toBe(false)
  })

  it("should return false when CCR matches but there are no PNC disposal", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "2"
    aho.PncQuery!.courtCases![0].courtCaseReference = "2"
    aho.PncQuery!.courtCases![0].offences![0].disposals = []

    const result = areAllPncResults2007(aho)

    expect(result).toBe(false)
  })

  it("should return false when CCR matches but PNC disposal is undefined", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "2"
    aho.PncQuery!.courtCases![0].courtCaseReference = "2"
    aho.PncQuery!.courtCases![0].offences![0].disposals = undefined

    const result = areAllPncResults2007(aho)

    expect(result).toBe(false)
  })

  it("should return false when CCR matches but PNC court cases are undefined", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "2"
    aho.PncQuery!.courtCases = undefined

    const result = areAllPncResults2007(aho)

    expect(result).toBe(false)
  })

  it("should return false when CCR matches but PNC query are undefined", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "2"
    aho.PncQuery = undefined

    const result = areAllPncResults2007(aho)

    expect(result).toBe(false)
  })

  it("should return false when all PNC disposals are 2007 but CCR does not match", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "3"
    aho.PncQuery!.courtCases![0].courtCaseReference = "2"
    aho.PncQuery!.courtCases![0].offences![0].disposals = [{ type: 2007 }, { type: 2007 }]

    const result = areAllPncResults2007(aho)

    expect(result).toBe(false)
  })
})
