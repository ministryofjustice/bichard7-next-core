import type { Offence } from "../../types/AnnotatedHearingOutcome"

import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import HO200200 from "./HO200200"

const generateAho = (ResultVariableText?: string) =>
  generateAhoFromOffenceList([
    { Result: [{ ResultVariableText, ResultQualifierVariable: [], CJSresultCode: 3041 }] }
  ] as any as Offence[])

describe("HO200200", () => {
  it("should return exception when disposal text length is more than 64 characters", () => {
    const aho = generateAho(`DEFENDANT EXCLUDED FROM ${"a".repeat(64)} FOR A PERIOD OF`)

    const exceptions = HO200200(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200200",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "ResultVariableText"
        ]
      }
    ])
  })

  it("should not return exception when disposal text length is less than 64 characters", () => {
    const aho = generateAho(`DEFENDANT EXCLUDED FROM ${"a".repeat(10)} FOR A PERIOD OF`)

    const exceptions = HO200200(aho)

    expect(exceptions).toHaveLength(0)
  })

  it("should not return exception when result variable text is not set", () => {
    const aho = generateAho(undefined)

    const exceptions = HO200200(aho)

    expect(exceptions).toHaveLength(0)
  })
})
