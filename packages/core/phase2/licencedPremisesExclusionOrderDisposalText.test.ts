import licencedPremisesExclusionOrderDisposalText from "./licencedPremisesExclusionOrderDisposalText"

describe("licencedPremised", () => {
  it("returns an empty string if no exclusion requirement text fourn", () => {
    expect(licencedPremisesExclusionOrderDisposalText("THIS IS NOT AN EXCLUSION REQUIREMENT")).toBe("")
  })

  it("returns the location of the licenced premises", () => {
    expect(
      licencedPremisesExclusionOrderDisposalText(
        "DEFENDANT EXCLUDED FROM LICENCED LOCATION FOR A PERIOD OF TIME"
      )
    ).toBe("EXCLUDED FROM LICENCED LOCATION")
  })

  it("returns the longest location if multiple matches", () => {
    expect(
      licencedPremisesExclusionOrderDisposalText(
        "DEFENDANT EXCLUDED FROM MORE SPECIFIC LICENCED LOCATION FOR A PERIOD OF TIME DEFENDANT EXCLUDED FROM LICENCED LOCATION FOR A PERIOD OF TIME"
      )
    ).toBe("EXCLUDED FROM MORE SPECIFIC LICENCED LOCATION")

    expect(
      licencedPremisesExclusionOrderDisposalText(
        "DEFENDANT EXCLUDED FROM LICENCED LOCATION FOR A PERIOD OF TIME DEFENDANT EXCLUDED FROM MORE SPECIFIC LICENCED LOCATION FOR A PERIOD OF TIME"
      )
    ).toBe("EXCLUDED FROM MORE SPECIFIC LICENCED LOCATION")
  })

  it("matches across line breaks", () => {
    expect(
      licencedPremisesExclusionOrderDisposalText(
        `DEFENDANT
      EXCLUDED
      FROM
      LOCATION
      FOR
      A
      PERIOD
      OF
      TIME`
      )
    ).toBe("EXCLUDED FROM LOCATION")
  })

  it("returns an empty string if no disposal text", () => {
    expect(licencedPremisesExclusionOrderDisposalText("")).toBe("")
  })

  it("returns an empty string no location in result text", () => {
    expect(
      licencedPremisesExclusionOrderDisposalText("DEFENDANT EXCLUDED FROMFOR A PERIOD OF TIME")
    ).toBe("")
  })

  it("returns exclusion text if location is whitespace", () => {
    expect(
      licencedPremisesExclusionOrderDisposalText("DEFENDANT EXCLUDED FROM FOR A PERIOD OF TIME")
    ).toBe("EXCLUDED FROM ")
  })
})
