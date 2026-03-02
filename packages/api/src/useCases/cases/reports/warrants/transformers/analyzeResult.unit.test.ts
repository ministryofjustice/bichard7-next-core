import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { CJS_CODES, QUALIFIER_CODES } from "../warrantConfiguration"
import { analyzeResult } from "./analyzeResult"

describe("analyzeResult", () => {
  const createMockResult = (overrides: Partial<Result> = {}): Result =>
    ({
      CJSresultCode: "1000",
      ResultQualifierVariable: [],
      ResultVariableText: "Default result text",
      ...overrides
    }) as unknown as Result

  it("should correctly identify a parent result and extract warrant text", () => {
    const mockResult = createMockResult({
      CJSresultCode: CJS_CODES.PARENT[0],
      ResultVariableText: "Warrant for arrest"
    })

    const analysis = analyzeResult(mockResult)

    expect(analysis.parentResult).toBe(true)
    expect(analysis.warrantResultText).toBe("Warrant for arrest")
    expect(analysis.withdrawnResultText).toBeUndefined()
  })

  it("should correctly identify a witness result", () => {
    const mockResult = createMockResult({
      CJSresultCode: CJS_CODES.WITNESS[0]
    })

    const analysis = analyzeResult(mockResult)

    expect(analysis.witnessResult).toBe(true)
    expect(analysis.warrantResultText).toBeDefined()
  })

  it("should identify bail and no-bail statuses independently", () => {
    const bailResult = createMockResult({ CJSresultCode: CJS_CODES.BAIL[0] })
    const noBailResult = createMockResult({ CJSresultCode: CJS_CODES.NO_BAIL[0] })

    const bailAnalysis = analyzeResult(bailResult)
    const noBailAnalysis = analyzeResult(noBailResult)

    expect(bailAnalysis.bail).toBe(true)
    expect(noBailAnalysis.noBail).toBe(true)
  })

  it("should detect first instance based on qualifier codes", () => {
    const mockResult = createMockResult({
      ResultQualifierVariable: [{ Code: QUALIFIER_CODES.FIRST_INSTANCE[0] }]
    } as any)

    const analysis = analyzeResult(mockResult)

    expect(analysis.firstInstance).toBe(true)
  })

  it("should extract withdrawn text when the code matches withdrawn configuration", () => {
    const withdrawnCode = CJS_CODES.WITHDRAWN[0]
    const mockResult = createMockResult({
      CJSresultCode: withdrawnCode,
      ResultVariableText: "Case withdrawn"
    })

    const analysis = analyzeResult(mockResult)

    expect(analysis.withdrawnResultText).toBe("Case withdrawn")
  })

  it("should not extract warrant text for a withdrawn-only code", () => {
    // Find a code that is in WITHDRAWN but NOT in any warrant-related categories
    const withdrawnOnlyCode = CJS_CODES.WITHDRAWN.find(
      (code) =>
        !CJS_CODES.PARENT.includes(code) &&
        !CJS_CODES.WITNESS.includes(code) &&
        !CJS_CODES.BAIL.includes(code) &&
        !CJS_CODES.NO_BAIL.includes(code)
    )

    // Use the found code, or a numeric fallback if find returns undefined
    // We cast to 'any' then 'number' if the config uses mixed types,
    // or just use a number if the type is strictly number.
    const codeToTest = (withdrawnOnlyCode ?? 9999) as number

    const mockResult = createMockResult({
      CJSresultCode: codeToTest,
      ResultVariableText: "Some text"
    })

    const analysis = analyzeResult(mockResult)

    expect(analysis.warrantResultText).toBeUndefined()
  })

  it("should return all false flags and no text when no codes match", () => {
    const mockResult = createMockResult({
      CJSresultCode: "999999", // Unknown code
      ResultQualifierVariable: [{ Code: "UNKNOWN" }]
    } as any)

    const analysis = analyzeResult(mockResult)

    expect(analysis).toEqual({
      bail: false,
      firstInstance: false,
      noBail: false,
      parentResult: false,
      warrantResultText: undefined,
      withdrawnResultText: undefined,
      witnessResult: false
    })
  })

  it("should not extract warrant text if ResultVariableText is missing even if code matches", () => {
    const mockResult = createMockResult({
      CJSresultCode: CJS_CODES.PARENT[0],
      ResultVariableText: undefined
    })

    const analysis = analyzeResult(mockResult)

    expect(analysis.parentResult).toBe(true)
    expect(analysis.warrantResultText).toBeUndefined()
  })
})
