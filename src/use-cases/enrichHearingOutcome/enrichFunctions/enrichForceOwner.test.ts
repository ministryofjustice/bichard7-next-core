import type { AnnotatedHearingOutcome, Case } from "src/types/AnnotatedHearingOutcome"
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

  it("should update organisational unit from the PNC response", () => {
    const c: Case = aho.AnnotatedHearingOutcome.HearingOutcome.Case

    c.ForceOwner = {
      SecondLevelCode: "00",
      ThirdLevelCode: "00",
      BottomLevelCode: "00",
      OrganisationUnitCode: "000000"
    }
    const result = enrichForceOwner(aho)
    expect(result.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toStrictEqual(c.ForceOwner)
  })
})
