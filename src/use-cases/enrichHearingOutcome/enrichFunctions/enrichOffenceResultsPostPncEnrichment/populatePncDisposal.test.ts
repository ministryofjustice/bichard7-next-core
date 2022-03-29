jest.mock("src/use-cases/dataLookup")
import type { AnnotatedHearingOutcome, Result } from "src/types/AnnotatedHearingOutcome"
import populatePncDisposal from "./populatePncDisposal"
import {
  GUILTY_OF_ALTERNATIVE,
  PNC_DISPOSAL_TYPE,
  RESULT_ADJOURNMENT_WITH_JUDGEMENT,
  RESULT_JUDGEMENT_WITH_FINAL_RESULT,
  VICTIM_SURCHARGE_AMOUNT_IN_POUNDS
} from "../../../../lib/properties"
import { lookupPncDisposalByCjsCode } from "src/use-cases/dataLookup"

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
      ResultClass: "",
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
      ResultClass: "",
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
      pncAdjudication: "PNC Adjudication",
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
      ResultClass: RESULT_JUDGEMENT_WITH_FINAL_RESULT,
      CRESTDisposalCode: "",
      ResultVariableText: "",
      AmountSpecifiedInResult: [0],
      Verdict: ""
    } as Result

    populatePncDisposal(hearingOutcome, result)

    expect(result.PNCDisposalType).toBe("PNC Adjudication")
  })

  it("should set PNCDisposalType to PNC Adjudication when result class is RESULT_ADJOURNMENT_WITH_JUDGEMENT", () => {
    const mockedLookupPncDisposalByCjsCode = lookupPncDisposalByCjsCode as jest.MockedFunction<
      typeof lookupPncDisposalByCjsCode
    >
    mockedLookupPncDisposalByCjsCode.mockReturnValue({
      cjsCode: "",
      description: "",
      pncAdjudication: "PNC Adjudication 2",
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
      ResultClass: RESULT_ADJOURNMENT_WITH_JUDGEMENT,
      CRESTDisposalCode: "",
      ResultVariableText: "",
      AmountSpecifiedInResult: [0],
      Verdict: ""
    } as Result

    populatePncDisposal(hearingOutcome, result)

    expect(result.PNCDisposalType).toBe("PNC Adjudication 2")
  })

  it("should set PNCDisposalType to PNC Non-Adjudication", () => {
    const mockedLookupPncDisposalByCjsCode = lookupPncDisposalByCjsCode as jest.MockedFunction<
      typeof lookupPncDisposalByCjsCode
    >
    mockedLookupPncDisposalByCjsCode.mockReturnValue({
      cjsCode: "",
      description: "",
      pncAdjudication: "",
      pncNonAdjudication: "PNC Non Adjudication"
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
      ResultClass: "Dummy Result Class",
      CRESTDisposalCode: "",
      ResultVariableText: "",
      AmountSpecifiedInResult: [0],
      Verdict: ""
    } as Result

    populatePncDisposal(hearingOutcome, result)

    expect(result.PNCDisposalType).toBe("PNC Non Adjudication")
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
      ResultClass: "Dummy Result Class",
      CRESTDisposalCode: "",
      ResultVariableText: "",
      AmountSpecifiedInResult: [0],
      Verdict: ""
    } as Result

    populatePncDisposal(hearingOutcome, result)

    expect(result.PNCDisposalType).toBe("999")
  })
})
