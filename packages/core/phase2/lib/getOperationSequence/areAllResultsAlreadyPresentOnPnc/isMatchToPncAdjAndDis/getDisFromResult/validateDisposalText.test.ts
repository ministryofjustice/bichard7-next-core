import generateAhoFromOffenceList from "../../../../../tests/fixtures/helpers/generateAhoFromOffenceList"
import validateDisposalText, { maxDisposalTextLength } from "./validateDisposalText"

describe("validateDisposalText", () => {
  it("If disposal text is too long, an exception HO200200 is added to the Aho", () => {
    const aho = generateAhoFromOffenceList([])
    const disposalText = "a".repeat(maxDisposalTextLength + 1)

    validateDisposalText(disposalText, aho, 0, 0)

    expect(aho.Exceptions).toStrictEqual([
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

  it("If disposal text is too long, it is truncated with a '+', at max length", () => {
    const aho = generateAhoFromOffenceList([])
    const disposalText = "a".repeat(maxDisposalTextLength + 1)

    const validatedDisposalText = validateDisposalText(disposalText, aho, 0, 0)

    expect(validatedDisposalText).toHaveLength(maxDisposalTextLength)
    expect(validatedDisposalText).toBe(`${"a".repeat(maxDisposalTextLength - 1)}+`)
  })

  it("If disposal text is within allowed length, it is returned unchanged", () => {
    const aho = generateAhoFromOffenceList([])
    const disposalText = "a".repeat(maxDisposalTextLength)

    const result = validateDisposalText(disposalText, aho, 0, 0)

    expect(result).toEqual(disposalText)
  })
})
