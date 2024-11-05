import areAllResultsOnPnc from "./areAllResultsOnPnc"
import generateAhoMatchingPncAdjudicationAndDisposals from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"

describe("areAllResultsOnPnc", () => {
  it("returns true when all offences match to the PNC adjudication and disposals", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({ hasAdditionalMatchingOffence: true })

    const result = areAllResultsOnPnc(aho)

    expect(result).toBe(true)
  })

  it("returns false when not all offences match to the PNC adjudication and disposals", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({
      hasAdditionalMatchingOffence: true,
      firstResultDisposalType: 9999
    })

    const result = areAllResultsOnPnc(aho)

    expect(result).toBe(false)
  })
})
