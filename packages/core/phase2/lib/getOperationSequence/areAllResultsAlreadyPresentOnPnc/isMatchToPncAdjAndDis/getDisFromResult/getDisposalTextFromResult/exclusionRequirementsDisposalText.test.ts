import exclusionRequirementsDisposalText from "./exclusionRequirementsDisposalText"

describe("exclusionRequirementsDisposalText", () => {
  it("returns an empty string if no exclusion requirement text found", () => {
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

  it("matches across line breaks", () => {
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

  it("matches longest locations across line breaks", () => {
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
    ).toBe("EXCLUDED FROM MORE       SPECIFIC       LOCATION")
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

  it("still extracts location if a closing clause is missing", () => {
    const resultVariableText =
      "ERP - NOT TO ENTER FOR A PERIOD\nEXCLUSION REQUIREMENT: NOT TO ENTER LOCATION. THIS EXCLUSION REQUIREMENT LASTS FOR 24 MONTHS. NOT ELECTRONICALLY MONITORED AS NOT PRACTICAL"
    const result = exclusionRequirementsDisposalText(resultVariableText.toUpperCase())

    expect(result).toBe("EXCLUDED FROM LOCATION.")
  })

  it("keeps extra whitespace included in locations", () => {
    const resultVariableText =
      "ERP - NOT TO ENTER FOR A PERIOD\nEXCLUSION REQUIREMENT: NOT TO ENTER LOCATION NAME OR LOCATION NAME  CITY. THIS EXCLUSION REQUIREMENT LASTS FOR 24 MONTHS."

    expect(exclusionRequirementsDisposalText(resultVariableText)).toBe(
      "EXCLUDED FROM LOCATION NAME OR LOCATION NAME  CITY."
    )
  })
})
