import type { Result } from "../../types/AnnotatedHearingOutcome"
import penaltyPointsDisposalText from "./penaltyPointsDisposalText"

describe("check penaltyPointsDisposalText", () => {
  it("Executes", () => {
    const ahoResult = {} as Result
    const result = penaltyPointsDisposalText(ahoResult)

    expect(result).toBe("")
  })
  it("Given numberSpecifiedInResults 3, disposal text is '3 PENALTY POINTS'", () => {
    const ahoResult = {
      NumberSpecifiedInResult: [{ Number: 3 }]
    } as Result
    const result = penaltyPointsDisposalText(ahoResult)

    expect(result).toBe("3 PENALTY POINTS")
  })
  it("Given no numberSpecifiedInResults, disposal text is an empty string", () => {
    const ahoResult = {
      NumberSpecifiedInResult: [{ Type: "foo" }]
    } as Result
    const result = penaltyPointsDisposalText(ahoResult)

    expect(result).toBe("")
  })
})
