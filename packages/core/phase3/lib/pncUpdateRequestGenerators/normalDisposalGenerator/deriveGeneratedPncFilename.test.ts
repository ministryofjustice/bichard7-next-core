import type { HearingDefendant } from "../../../../types/AnnotatedHearingOutcome"

import deriveGeneratedPncFilename from "./deriveGeneratedPncFilename"

describe("deriveGeneratedPncFilename", () => {
  describe("when defendant is a person", () => {
    it.each([
      {
        test: "return '/' when hearing outcome's generated PNC filename is undefined",
        pncFilename: undefined,
        expected: "/"
      },
      {
        test: "return '/' when hearing outcome's generated PNC filename is empty string",
        pncFilename: "",
        expected: "/"
      },
      {
        test: "not add '/' to the output string when hearing outcome's generated PNC filename already has a '/'",
        pncFilename: "SMITH/JOHN",
        expected: "SMITH/JOHN"
      },
      {
        test: "add '/' to the output string when hearing outcome's generated PNC filename does not have a '/'",
        pncFilename: "SMITHJOHN",
        expected: "SMITHJOHN/"
      }
    ])("should $test", ({ pncFilename, expected }) => {
      const hearingDefendant = {
        DefendantDetail: {
          PersonName: { FamilyName: "Dummy name" },
          GeneratedPNCFilename: pncFilename,
          BirthDate: new Date(),
          Gender: 1
        }
      } as HearingDefendant

      const result = deriveGeneratedPncFilename(hearingDefendant)

      expect(result).toBe(expected)
    })
  })

  describe("when defendant is an organisation", () => {
    it.each([
      { name: "", nameText: "empty string" },
      { name: undefined, nameText: "undefined" }
    ])("should return empty string when organisation name is $nameText", ({ name }) => {
      const hearingDefendant = {
        OrganisationName: name
      } as HearingDefendant

      const result = deriveGeneratedPncFilename(hearingDefendant)

      expect(result).toBe("")
    })

    it("should replace illegal characters with a white space and, trim and remove duplicate white spaces", () => {
      const hearingDefendant = {
        OrganisationName: " COMPANY_/+A    !@£$%^&*()_+=/`~?.,<>;'][{}|\":B "
      } as HearingDefendant

      const result = deriveGeneratedPncFilename(hearingDefendant)

      expect(result).toBe("COMPANY / A / B")
    })

    it("should add '/' to the end of string when it does not have '/'", () => {
      const hearingDefendant = {
        OrganisationName: "A".repeat(53)
      } as HearingDefendant

      const result = deriveGeneratedPncFilename(hearingDefendant)

      expect(result).toBe(`${"A".repeat(53)}/`)
    })

    it("should truncate the name and add a '+' to the end of string when the length is more than 54 characters", () => {
      const hearingDefendant = {
        OrganisationName: `A/${"B".repeat(53)}`
      } as HearingDefendant

      const result = deriveGeneratedPncFilename(hearingDefendant)

      expect(result).toBe(`A/${"B".repeat(51)}+`)
    })

    it("should truncate the name and add a '/+' to the end of string when the length is more than 54 characters and string does not have '/'", () => {
      const hearingDefendant = {
        OrganisationName: "A".repeat(55)
      } as HearingDefendant

      const result = deriveGeneratedPncFilename(hearingDefendant)

      expect(result).toBe(`${"A".repeat(52)}/+`)
    })
  })
})
