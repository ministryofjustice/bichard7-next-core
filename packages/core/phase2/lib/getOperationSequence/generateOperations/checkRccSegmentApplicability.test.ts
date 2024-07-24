import type { AnnotatedHearingOutcome, Offence, Result } from "../../../../types/AnnotatedHearingOutcome"
import ResultClass from "../../../../types/ResultClass"
import checkRccSegmentApplicability, { RccSegmentApplicability } from "./checkRccSegmentApplicability"

const createAho = (offences: Partial<Offence>[]) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            Offence: offences
          }
        }
      }
    }
  }) as AnnotatedHearingOutcome

describe("checkRccSegmentApplicability", () => {
  it("should return CaseDoesNotRequireRcc when there are no recordable offences", () => {
    const aho = createAho([
      {
        AddedByTheCourt: false,
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "B7",
        CourtCaseReferenceNumber: "123",
        Result: [{ PNCDisposalType: 2060 } as unknown as Result]
      }
    ])
    const result = checkRccSegmentApplicability(aho, "123")

    expect(result).toBe(RccSegmentApplicability.CaseDoesNotRequireRcc)
  })

  it("should return CaseDoesNotRequireRcc when there are no matching offences", () => {
    const aho = createAho([
      {
        AddedByTheCourt: false,
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "ZZ",
        CourtCaseReferenceNumber: "456",
        Result: [{ PNCDisposalType: 2060 } as unknown as Result]
      }
    ])
    const result = checkRccSegmentApplicability(aho, "123")

    expect(result).toBe(RccSegmentApplicability.CaseDoesNotRequireRcc)
  })

  it("should return CaseDoesNotRequireRcc when offences do not contain PNC disposal type 2060", () => {
    const aho = createAho([
      {
        AddedByTheCourt: false,
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "ZZ",
        CourtCaseReferenceNumber: "123",
        Result: [{ PNCDisposalType: 2061 } as unknown as Result]
      }
    ])
    const result = checkRccSegmentApplicability(aho, "123")

    expect(result).toBe(RccSegmentApplicability.CaseDoesNotRequireRcc)
  })

  it("should return CaseDoesNotRequireRcc when offences are added by court and are not DISARR compatible", () => {
    const aho = createAho([
      {
        AddedByTheCourt: true,
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "ZZ",
        CourtCaseReferenceNumber: "123",
        Result: [{ PNCDisposalType: 2060, ResultClass: ResultClass.SENTENCE } as unknown as Result]
      }
    ])
    const result = checkRccSegmentApplicability(aho, "123")

    expect(result).toBe(RccSegmentApplicability.CaseDoesNotRequireRcc)
  })

  it("should return CaseRequiresRccAndHasReportableOffences when case requires RCC and offence is added by the court and is DISARR compatible", () => {
    const aho = createAho([
      {
        AddedByTheCourt: true,
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "ZZ",
        CourtCaseReferenceNumber: "123",
        Result: [{ PNCDisposalType: 2060 } as unknown as Result]
      }
    ])
    const result = checkRccSegmentApplicability(aho, "123")

    expect(result).toBe(RccSegmentApplicability.CaseRequiresRccAndHasReportableOffences)
  })

  it("should return CaseRequiresRccButHasNoReportableOffences when case requires RCC and offence is added by the court but not DISARR compatible", () => {
    const aho = createAho([
      {
        AddedByTheCourt: false,
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "ZZ",
        CourtCaseReferenceNumber: "123",
        Result: [{ PNCDisposalType: 2060 } as unknown as Result]
      },
      {
        AddedByTheCourt: true,
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "ZZ",
        CourtCaseReferenceNumber: "123",
        Result: [{ PNCDisposalType: 2060, ResultClass: ResultClass.SENTENCE } as unknown as Result]
      }
    ])
    const result = checkRccSegmentApplicability(aho, "123")

    expect(result).toBe(RccSegmentApplicability.CaseRequiresRccButHasNoReportableOffences)
  })

  it("should return CaseRequiresRccButHasNoReportableOffences when case requires RCC and there is an offence that is DISARR compatible but not added by the court", () => {
    const aho = createAho([
      {
        AddedByTheCourt: false,
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "ZZ",
        CourtCaseReferenceNumber: "123",
        Result: [{ PNCDisposalType: 2060 } as unknown as Result]
      },
      {
        AddedByTheCourt: false,
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "ZZ",
        CourtCaseReferenceNumber: "123",
        Result: [{ PNCDisposalType: 2060 } as unknown as Result]
      }
    ])
    const result = checkRccSegmentApplicability(aho, "123")

    expect(result).toBe(RccSegmentApplicability.CaseRequiresRccButHasNoReportableOffences)
  })
})
