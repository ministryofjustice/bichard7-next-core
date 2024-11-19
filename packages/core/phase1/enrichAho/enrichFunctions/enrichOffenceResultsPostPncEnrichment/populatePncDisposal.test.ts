jest.mock("../../../../lib/dataLookup")
import type { AnnotatedHearingOutcome, Result } from "../../../../types/AnnotatedHearingOutcome"

import { lookupPncDisposalByCjsCode } from "../../../../lib/dataLookup"
import ResultClass from "../../../../types/ResultClass"
import populatePncDisposal from "./populatePncDisposal"

describe("populatePncDisposal", () => {
  it("should set PNCDisposalType to VICTIM_SURCHARGE", () => {
    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            CourtType: "M_Dummy Court Type"
          }
        }
      }
    } as AnnotatedHearingOutcome
    const result = {
      AmountSpecifiedInResult: [{ Amount: 345 }, { Amount: 15 }],
      CJSresultCode: 123,
      CRESTDisposalCode: "FDINST",
      ResultVariableText: "It expects to see {victim surcharge}",
      Verdict: ""
    } as Result

    populatePncDisposal(hearingOutcome, result)

    expect(result.PNCDisposalType).toBe(3117)
  })

  it("should set PNCDisposalType to GUILTY_OF_ALTERNATIVE", () => {
    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            CourtType: "*_Dummy Court Type"
          }
        }
      }
    } as AnnotatedHearingOutcome
    const result = {
      AmountSpecifiedInResult: [{ Amount: 0 }],
      CJSresultCode: 123,
      CRESTDisposalCode: "",
      ResultVariableText: "",
      Verdict: "NA"
    } as Result

    populatePncDisposal(hearingOutcome, result)

    expect(result.PNCDisposalType).toBe(2060)
  })

  it("should set PNCDisposalType to PNC Adjudication when result class is RESULT_JUDGEMENT_WITH_FINAL_RESULT", () => {
    const mockedLookupPncDisposalByCjsCode = lookupPncDisposalByCjsCode as jest.MockedFunction<
      typeof lookupPncDisposalByCjsCode
    >
    mockedLookupPncDisposalByCjsCode.mockReturnValue({
      cjsCode: "",
      description: "",
      pncAdjudication: "2000",
      pncNonAdjudication: ""
    })

    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            CourtType: "*_Dummy Court Type"
          }
        }
      }
    } as AnnotatedHearingOutcome
    const result = {
      AmountSpecifiedInResult: [{ Amount: 0 }],
      CJSresultCode: 123,
      CRESTDisposalCode: "",
      ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
      ResultVariableText: "",
      Verdict: ""
    } as Result

    populatePncDisposal(hearingOutcome, result)

    expect(result.PNCDisposalType).toBe(2000)
  })

  it("should set PNCDisposalType to PNC Adjudication when result class is RESULT_ADJOURNMENT_WITH_JUDGEMENT", () => {
    const mockedLookupPncDisposalByCjsCode = lookupPncDisposalByCjsCode as jest.MockedFunction<
      typeof lookupPncDisposalByCjsCode
    >
    mockedLookupPncDisposalByCjsCode.mockReturnValue({
      cjsCode: "",
      description: "",
      pncAdjudication: "3000",
      pncNonAdjudication: ""
    })

    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            CourtType: "*_Dummy Court Type"
          }
        }
      }
    } as AnnotatedHearingOutcome
    const result = {
      AmountSpecifiedInResult: [{ Amount: 0 }],
      CJSresultCode: 123,
      CRESTDisposalCode: "",
      ResultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT,
      ResultVariableText: "",
      Verdict: ""
    } as Result

    populatePncDisposal(hearingOutcome, result)

    expect(result.PNCDisposalType).toBe(3000)
  })

  it("should set PNCDisposalType to PNC Non-Adjudication", () => {
    const mockedLookupPncDisposalByCjsCode = lookupPncDisposalByCjsCode as jest.MockedFunction<
      typeof lookupPncDisposalByCjsCode
    >
    mockedLookupPncDisposalByCjsCode.mockReturnValue({
      cjsCode: "",
      description: "",
      pncAdjudication: "",
      pncNonAdjudication: "4000"
    })

    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            CourtType: "*_Dummy Court Type"
          }
        }
      }
    } as AnnotatedHearingOutcome
    const result = {
      AmountSpecifiedInResult: [{ Amount: 0 }],
      CJSresultCode: 123,
      CRESTDisposalCode: "",
      ResultClass: ResultClass.UNRESULTED,
      ResultVariableText: "",
      Verdict: ""
    } as Result

    populatePncDisposal(hearingOutcome, result)

    expect(result.PNCDisposalType).toBe(4000)
  })

  it("should set PNCDisposalType to CJS Result Code", () => {
    const mockedLookupPncDisposalByCjsCode = lookupPncDisposalByCjsCode as jest.MockedFunction<
      typeof lookupPncDisposalByCjsCode
    >
    mockedLookupPncDisposalByCjsCode.mockReturnValue(undefined)

    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            CourtType: "*_Dummy Court Type"
          }
        }
      }
    } as AnnotatedHearingOutcome
    const result = {
      AmountSpecifiedInResult: [{ Amount: 0 }],
      CJSresultCode: 999,
      CRESTDisposalCode: "",
      ResultClass: ResultClass.UNRESULTED,
      ResultVariableText: "",
      Verdict: ""
    } as Result

    populatePncDisposal(hearingOutcome, result)

    expect(result.PNCDisposalType).toBe(999)
  })
})
