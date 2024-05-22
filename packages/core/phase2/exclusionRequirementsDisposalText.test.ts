import exclusionRequirementsDisposalText from "./exclusionRequirementsDisposalText"

describe("exclusionRequirementsDisposalText", () => {
  it("returns an empty string if no exclusion requirement text fourn", () => {
    expect(exclusionRequirementsDisposalText("THIS IS NOT AN EXCLUSION REQUIREMENT")).toBe("")
  })

  it("returns the location from a short result string", () => {
    expect(exclusionRequirementsDisposalText("NOT ENTER LOCATION THIS EXCLUSION REQUIREMENT LASTS FOR TIME")).toBe(
      "EXCLUDED FROM LOCATION"
    )
  })

  it("returns the location from a longer string", () => {
    expect(exclusionRequirementsDisposalText("NOT TO ENTER LOCATION THIS EXCLUSION REQUIREMENT LASTS FOR TIME")).toBe(
      "EXCLUDED FROM LOCATION"
    )
  })

  it("uses the longer of two matches", () => {
    expect(
      exclusionRequirementsDisposalText(
        `NOT ENTER LOCATION THIS EXCLUSION REQUIREMENT LASTS FOR TIME SOME
        OTHER TEXT
        NOT TO ENTER MORE SPECIFIC LOCATION THIS EXCLUSION REQUIREMENT LASTS FOR TIME`
      )
    ).toBe("EXCLUDED FROM MORE SPECIFIC LOCATION")
  })

  it("matches correctly if no line breaks", () => {
    expect(
      exclusionRequirementsDisposalText(
        "NOT TO ENTER LOCATION THIS EXCLUSION REQUIREMENT LASTS FOR TIME SOME OTHER TEXT NOT TO ENTER MORE SPECIFIC LOCATION THIS EXCLUSION REQUIREMENT LASTS FOR TIME NOT TO ENTER LOCATION1 THIS EXCLUSION REQUIREMENT LASTS FOR TIME SOME OTHER TEXT NOT TO ENTER MORE SPECIFIC LOCATION THIS EXCLUSION REQUIREMENT LASTS FOR TIME"
      )
    ).toBe("EXCLUDED FROM MORE SPECIFIC LOCATION")
  })

  it("matches accross line breaks", () => {
    expect(
      exclusionRequirementsDisposalText(
        `NOT
      TO
      ENTER
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

  it("matches longest locations accross line breaks", () => {
    expect(
      exclusionRequirementsDisposalText(
        `NOT
      TO
      ENTER
      LOCATION
      THIS
      EXCLUSION
      REQUIREMENT
      LASTS
      FOR
      TIME
      NOT
      TO
      ENTER
      MORE
      SPECIFIC
      LOCATION
      THIS
      EXCLUSION
      REQUIREMENT
      LASTS
      FOR
      TIME`
      )
    ).toBe("EXCLUDED FROM MORE SPECIFIC LOCATION")
  })

  it("returns an empty string if no disposal text", () => {
    expect(exclusionRequirementsDisposalText("")).toBe("")
  })

  it("returns an empty string no location in result text", () => {
    expect(exclusionRequirementsDisposalText("NOT ENTERTHIS EXCLUSION REQUIREMENT LASTS FOR TIME")).toBe("")
  })

  it("returns exclusion text if location is whitespace", () => {
    expect(exclusionRequirementsDisposalText("NOT ENTER THIS EXCLUSION REQUIREMENT LASTS FOR TIME")).toBe(
      "EXCLUDED FROM "
    )
  })
})
