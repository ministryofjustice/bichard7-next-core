import generateAhoMatchingPncAdjudicationAndDisposals from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import areAllResultsOnPnc from "./areAllResultsOnPnc"

describe("areAllResultsOnPnc", () => {
  it("returns true when all offences match to the PNC adjudication and disposals", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({ hasAdditionalMatchingOffence: true })

    const result = areAllResultsOnPnc(aho)

    expect(result).toBe(true)
  })

  it("returns false when not all offences match to the PNC adjudication and disposals", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({
      firstResultDisposalType: 9999,
      hasAdditionalMatchingOffence: true
    })

    const result = areAllResultsOnPnc(aho)

    expect(result).toBe(false)
  })
})
