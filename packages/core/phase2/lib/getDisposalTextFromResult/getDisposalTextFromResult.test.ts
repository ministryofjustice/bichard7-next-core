import type { Result } from "../../../types/AnnotatedHearingOutcome"

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
      ResultQualifierVariable: [],
      ResultVariableText: "BEFORE DISQUALIFIED FROM KEEPING QWE FOR LIFE AFTER"
    } as unknown as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("QWE")
  })

  it("Given 1100 cjsResultCode, and ResultVariableText contains THE DEFENDANT IS NOT TO ENTER PLACE, disposal text is correct", () => {
    const ahoResult = {
      CJSresultCode: 1100,
      ResultQualifierVariable: [],
      ResultVariableText: "THE DEFENDANT IS NOT TO ENTER PLACE"
    } as unknown as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("EXCLUDED FROM PLACE")
  })

  it("Given 3041 cjsResultCode, and ResultVariableText contains DEFENDANT EXCLUDED FROM ABC FOR A PERIOD OF, disposal text is correct", () => {
    const ahoResult = {
      CJSresultCode: 3041,
      ResultQualifierVariable: [],
      ResultVariableText: "DEFENDANT EXCLUDED FROM ABC FOR A PERIOD OF"
    } as unknown as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("EXCLUDED FROM ABC")
  })

  it("Given ResultQualifierVariable exists and warrant is issued, disposal text is correct", () => {
    const ahoResult = {
      CJSresultCode: 4575,
      ResultQualifierVariable: [{ Code: "ZZ" }],
      ResultVariableText: "DUMMY"
    } as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("FAILED TO APPEAR WARRANT ISSUED")
  })

  it("Given ResultQualifierVariable exists but warrant is not issued, disposal text is empty", () => {
    const ahoResult = {
      CJSresultCode: 4575,
      ResultQualifierVariable: [{ Code: "EO" }],
      ResultVariableText: "DUMMY"
    } as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("")
  })

  it("Given 3106 cjsResultCode, and ResultVariableText contains NOT TO ENTER XYZ THIS EXCLUSION REQUIREMENT LASTS FOR, disposal text is correct", () => {
    const ahoResult = {
      CJSresultCode: 3106,
      ResultQualifierVariable: [],
      ResultVariableText: "NOT TO ENTER XYZ THIS EXCLUSION REQUIREMENT LASTS FOR"
    } as unknown as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("EXCLUDED FROM XYZ")
  })

  it("Given 3047 cjsResultCode, and ResultVariableText contains RESULT VARIABLE TEXT CONTAINS UNTIL FURTHER ORDER TEXT, disposal text is correct", () => {
    const ahoResult = {
      CJSresultCode: 3047,
      ResultQualifierVariable: [],
      ResultVariableText: "RESULT VARIABLE TEXT CONTAINS UNTIL FURTHER ORDER TEXT"
    } as unknown as Result
    const result = getDisposalTextFromResult(ahoResult)

    expect(result).toBe("UNTIL FURTHER ORDER")
  })

  it("Given durations with unit 'S', a suffix is added to the disposal text", () => {
    const ahoResult = {
      CJSresultCode: 1100,
      Duration: [
        {
          DurationLength: 10,
          DurationType: "Foo",
          DurationUnit: "S"
        }
      ],
      ResultQualifierVariable: [],
      ResultVariableText: "THE DEFENDANT IS NOT TO ENTER FOO"
    } as unknown as Result
    const result = getDisposalTextFromResult(ahoResult)
    expect(result).toBe("EXCLUDED FROM FOO 10 SESSIONS")
  })
})
