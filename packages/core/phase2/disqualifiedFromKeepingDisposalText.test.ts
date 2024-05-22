import type { Result } from "../types/AnnotatedHearingOutcome"
import disqualifiedFromKeepingDisposalText from "./disqualifiedFromKeepingDisposalText"

describe("check disqualifiedFromKeepingDisposalText", () => {
  it("Given result text containing a disqualification for life, returns the subject of the disqualification", () => {
    const ahoResult = {} as Result
    const resultVariableText = "DISQUALIFIED FROM KEEPING MINIATURE SHETLAND PONIES FOR LIFE"
    const result = disqualifiedFromKeepingDisposalText(ahoResult, resultVariableText)

    expect(result).toBe("MINIATURE SHETLAND PONIES")
  })
  it("Given result text with additional information, returns the subject of the disqualification", () => {
    const ahoResult = {} as Result
    const resultVariableText =
      "DISQUALIFIED FROM KEEPING MINIATURE SHETLAND PONIES FOR LIFE BECAUSE TRIED TO PUT THEM IN POCKET"
    const result = disqualifiedFromKeepingDisposalText(ahoResult, resultVariableText)

    expect(result).toBe("MINIATURE SHETLAND PONIES")
  })
  it("Given result text without disqualification text, returns an empty string", () => {
    const ahoResult = {} as Result
    const resultVariableText = "MINIATURE SHETLAND PONIES ARE VERY SMALL"
    const result = disqualifiedFromKeepingDisposalText(ahoResult, resultVariableText)

    expect(result).toBe("")
  })
})
