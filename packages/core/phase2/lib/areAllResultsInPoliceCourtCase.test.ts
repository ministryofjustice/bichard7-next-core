import generateAhoMatchingPncAdjudicationAndDisposals from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import areAllResultsInPoliceCourtCase from "./areAllResultsInPoliceCourtCase"

describe("areAllResultsInPoliceCourtCase", () => {
  it("returns true when all offences match to the police adjudication and disposals", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({ hasAdditionalMatchingOffence: true })

    const result = areAllResultsInPoliceCourtCase(aho)

    expect(result).toBe(true)
  })

  it("returns false when not all offences match to the police adjudication and disposals", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({
      hasAdditionalMatchingOffence: true,
      firstResultDisposalType: 9999
    })

    const result = areAllResultsInPoliceCourtCase(aho)

    expect(result).toBe(false)
  })
})
