jest.mock("src/use-cases/dataLookup")
import {
  GUILTY_OF_ALTERNATIVE,
  PNC_DISPOSAL_TYPE,
  ResultClass,
  VICTIM_SURCHARGE_AMOUNT_IN_POUNDS
} from "src/lib/properties"
import type { AnnotatedHearingOutcome, Result } from "src/types/AnnotatedHearingOutcome"
import { lookupPncDisposalByCjsCode } from "src/use-cases/dataLookup"
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
      CJSresultCode: 123,
      CRESTDisposalCode: "FDINST",
      ResultVariableText: "It expects to see {victim surcharge}",
      AmountSpecifiedInResult: [345, VICTIM_SURCHARGE_AMOUNT_IN_POUNDS],
      Verdict: ""
    } as Result

    populatePncDisposal(hearingOutcome, result)

    expect(result.PNCDisposalType).toBe(PNC_DISPOSAL_TYPE.VICTIM_SURCHARGE)
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
      CJSresultCode: 123,
      CRESTDisposalCode: "",
      ResultVariableText: "",
      AmountSpecifiedInResult: [0],
      Verdict: GUILTY_OF_ALTERNATIVE
    } as Result

    populatePncDisposal(hearingOutcome, result)

    expect(result.PNCDisposalType).toBe(PNC_DISPOSAL_TYPE.GUILTY_OF_ALTERNATIVE)
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
      CJSresultCode: 123,
      ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
      CRESTDisposalCode: "",
      ResultVariableText: "",
      AmountSpecifiedInResult: [0],
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
      CJSresultCode: 123,
      ResultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT,
      CRESTDisposalCode: "",
      ResultVariableText: "",
      AmountSpecifiedInResult: [0],
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
      CJSresultCode: 123,
      ResultClass: ResultClass.UNRESULTED,
      CRESTDisposalCode: "",
      ResultVariableText: "",
      AmountSpecifiedInResult: [0],
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
      CJSresultCode: 999,
      ResultClass: ResultClass.UNRESULTED,
      CRESTDisposalCode: "",
      ResultVariableText: "",
      AmountSpecifiedInResult: [0],
      Verdict: ""
    } as Result

    populatePncDisposal(hearingOutcome, result)

    expect(result.PNCDisposalType).toBe(999)
  })
})
