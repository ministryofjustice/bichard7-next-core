import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import amendForceOwner from "./amendForceOwner"

describe("amend force owner", () => {
  let aho: AnnotatedHearingOutcome
  let testString: string

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    testString = "04CA"
  })

  it("amends force owner when force owner property exist", () => {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = {
      SecondLevelCode: null,
      ThirdLevelCode: null,
      BottomLevelCode: null,
      OrganisationUnitCode: "original_value"
    }

    amendForceOwner(testString, aho)

    const forceOwner = aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner

    expect(forceOwner?.OrganisationUnitCode).toBe(`${testString.substring(0, 2)}YZ00`)
    expect(forceOwner?.SecondLevelCode).toBe("04")
    expect(forceOwner?.BottomLevelCode).toBe("00")
    expect(forceOwner?.ThirdLevelCode).toBe("YZ")
    expect(forceOwner?.TopLevelCode).toBeUndefined()
  })

  it("amends force owner when force owner property doesn't exist", () => {
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toBeUndefined()

    amendForceOwner(testString, aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode).toBe(
      `${testString.substring(0, 2)}YZ00`
    )
  })

  it("set manual force owner to true when the property doesn't already exist", () => {
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.ManualForceOwner).toBeUndefined()

    amendForceOwner(testString, aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.ManualForceOwner).toBe(true)
  })
})
