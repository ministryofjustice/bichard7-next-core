import type { Result } from "../types/AnnotatedHearingOutcome"
import getDisposalTextFromResult from "./getDisposalTextFromResult"

describe("check getDisposalTextFromResult", () => {
  it("Given empty cjsResultCode, disposal text is empty", () => {
    const ahoResult = { ResultQualifierVariable: [] } as unknown as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("")
  })

  it("Given 3008 cjsResultCode, and numberSpecifiedInResults 3, disposal text is correct", () => {
    const ahoResult = {
      CJSresultCode: 3008,
      NumberSpecifiedInResult: [{ Number: 3 }],
      ResultQualifierVariable: []
    } as unknown as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("3 PENALTY POINTS")
  })

  it("Given 3025 cjsResultCode, and ResultVariableText contains DISQUALIFIED FROM KEEPING FOR LIFE, disposal text is correct", () => {
    const ahoResult = {
      CJSresultCode: 3025,
      ResultVariableText: "BEFORE DISQUALIFIED FROM KEEPING QWE FOR LIFE AFTER",
      ResultQualifierVariable: []
    } as unknown as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("QWE")
  })

  it("Given 1100 cjsResultCode, and ResultVariableText contains THE DEFENDANT IS NOT TO ENTER PLACE, disposal text is correct", () => {
    const ahoResult = {
      CJSresultCode: 1100,
      ResultVariableText: "THE DEFENDANT IS NOT TO ENTER PLACE",
      ResultQualifierVariable: []
    } as unknown as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("EXCLUDED FROM PLACE")
  })

  it("Given 3041 cjsResultCode, and ResultVariableText contains DEFENDANT EXCLUDED FROM ABC FOR A PERIOD OF, disposal text is correct", () => {
    const ahoResult = {
      CJSresultCode: 3041,
      ResultVariableText: "DEFENDANT EXCLUDED FROM ABC FOR A PERIOD OF",
      ResultQualifierVariable: []
    } as unknown as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("EXCLUDED FROM ABC")
  })

  it("Given ResultQualifierVariable exists and warrant is issued, disposal text is correct", () => {
    const ahoResult = {
      CJSresultCode: 4575,
      ResultVariableText: "DUMMY",
      ResultQualifierVariable: [{ Code: "ZZ" }]
    } as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("FAILED TO APPEAR WARRANT ISSUED")
  })

  it("Given ResultQualifierVariable exists but warrant is not issued, disposal text is empty", () => {
    const ahoResult = {
      CJSresultCode: 4575,
      ResultVariableText: "DUMMY",
      ResultQualifierVariable: [{ Code: "EO" }]
    } as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("")
  })

  it("Given 3106 cjsResultCode, and ResultVariableText contains NOT TO ENTER XYZ THIS EXCLUSION REQUIREMENT LASTS FOR, disposal text is correct", () => {
    const ahoResult = {
      CJSresultCode: 3106,
      ResultVariableText: "NOT TO ENTER XYZ THIS EXCLUSION REQUIREMENT LASTS FOR",
      ResultQualifierVariable: []
    } as unknown as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("EXCLUDED FROM XYZ")
  })

  it("Given 3047 cjsResultCode, and ResultVariableText contains RESULT VARIABLE TEXT CONTAINS UNTIL FURTHER ORDER TEXT, disposal text is correct", () => {
    const ahoResult = {
      CJSresultCode: 3047,
      ResultVariableText: "RESULT VARIABLE TEXT CONTAINS UNTIL FURTHER ORDER TEXT",
      ResultQualifierVariable: []
    } as unknown as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("UNTIL FURTHER ORDER")
  })

  it("Given durations with unit 'S', a suffix is added to the disposal text", () => {
    const ahoResult = {
      CJSresultCode: 1100,
      Duration: [
        {
          DurationUnit: "S",
          DurationLength: 10,
          DurationType: "Foo"
        }
      ],
      ResultVariableText: "THE DEFENDANT IS NOT TO ENTER FOO",
      ResultQualifierVariable: []
    } as unknown as Result
    const result = getDisposalTextFromResult(ahoResult)
    expect(result).toBe("EXCLUDED FROM FOO 10 SESSIONS")
  })
})
