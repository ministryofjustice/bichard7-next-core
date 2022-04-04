import type { AnnotatedHearingOutcome, OrganisationUnit } from "src/types/AnnotatedHearingOutcome"
import generateMockAho from "tests/helpers/generateMockAho"
import enrichForceOwner from "./enrichForceOwner"

describe("enrichForceOwner", () => {
  let aho: AnnotatedHearingOutcome

  beforeEach(() => {
    aho = generateMockAho()
  })

  /* TODO:
    Tests for:
      Get force/station code from PNC response (unsure how/where in PNC response atm)

      Failing that, from PTIURN
      Failing that, from ASN
      Failing that, from CourtHearingLocation
      Failing that, error (probably just logging, no need to throw a runtime exception)

    Force code is two chars, station code is four

    Second level is first two characters always
    Third level is final two if station code, 00 if force code
    Bottom level is always 00
    OrganisationUnitCode is second + third + bottom
  */

  // Might need to modify comparison logic for returned xml
  // We'll need to pull out the rest of the aho from the old bichard database

  describe("when there is an FSCode in the PNC query", () => {
    it("should return a organisation unit from a valid station code", () => {
      aho.AnnotatedHearingOutcome.CXE01 = {
        FSCode: "01VK"
      }

      // aho.PncQuery?.forceStationCode

      const expected: OrganisationUnit = {
        SecondLevelCode: "01",
        ThirdLevelCode: "VK",
        BottomLevelCode: "00",
        OrganisationUnitCode: "01VK00"
      }

      const result = enrichForceOwner(aho)
      expect(result.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toStrictEqual(expected)
    })

    it("should return a organisation unit from a valid force code", () => {
      aho.AnnotatedHearingOutcome.CXE01 = {
        FSCode: "01"
      }

      const expected: OrganisationUnit = {
        SecondLevelCode: "01",
        ThirdLevelCode: "00",
        BottomLevelCode: "00",
        OrganisationUnitCode: "010000"
      }

      const result = enrichForceOwner(aho)
      expect(result.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toStrictEqual(expected)
    })
  })
})
