import licencedPremisesExclusionOrderDisposalText from "./licencedPremisesExclusionOrderDisposalText"

describe("licencedPremised", () => {
  it("returns an empty string if no exclusion requirement text fourn", () => {
    expect(licencedPremisesExclusionOrderDisposalText("THIS IS NOT AN EXCLUSION REQUIREMENT")).toBe("")
  })

  it("returns the location of the licenced premisis", () => {
    expect(
      licencedPremisesExclusionOrderDisposalText(
        "DEFENDANT EXCLUDED FROM LICENCED LOCATION THIS EXCLUSION REQUIREMENT LASTS FOR TIME"
      )
    ).toBe("EXCLUDED FROM LICENCED LOCATION")
  })

  it("returns the longest location if multiple matches", () => {
    expect(
      licencedPremisesExclusionOrderDisposalText(
        "DEFENDANT EXCLUDED FROM MORE SPECIFIC LICENCED LOCATION THIS EXCLUSION REQUIREMENT LASTS FOR TIME DEFENDANT EXCLUDED FROM LICENCED LOCATION THIS EXCLUSION REQUIREMENT LASTS FOR TIME"
      )
    ).toBe("EXCLUDED FROM MORE SPECIFIC LICENCED LOCATION")

    expect(
      licencedPremisesExclusionOrderDisposalText(
        "DEFENDANT EXCLUDED FROM LICENCED LOCATION THIS EXCLUSION REQUIREMENT LASTS FOR TIME DEFENDANT EXCLUDED FROM MORE SPECIFIC LICENCED LOCATION THIS EXCLUSION REQUIREMENT LASTS FOR TIME"
      )
    ).toBe("EXCLUDED FROM MORE SPECIFIC LICENCED LOCATION")
  })

  it("matches accross line breaks", () => {
    expect(
      licencedPremisesExclusionOrderDisposalText(
        `DEFENDANT
      EXCLUDED
      FROM
      LOCATION
      THIS
      EXCLUSION
      REQUIREMENT
      LASTS
      FOR
      TIME`
      )
    ).toBe("EXCLUDED FROM LOCATION")
  })

  it("returns an empty string if no disposal text", () => {
    expect(licencedPremisesExclusionOrderDisposalText("")).toBe("")
  })

  it("returns an empty string no location in result text", () => {
    expect(
      licencedPremisesExclusionOrderDisposalText("DEFENDANT EXCLUDED FROMTHIS EXCLUSION REQUIREMENT LASTS FOR TIME")
    ).toBe("")
  })

  it("returns exclusion text if location is whitespace", () => {
    expect(
      licencedPremisesExclusionOrderDisposalText("DEFENDANT EXCLUDED FROM THIS EXCLUSION REQUIREMENT LASTS FOR TIME")
    ).toBe("EXCLUDED FROM ")
  })
})
