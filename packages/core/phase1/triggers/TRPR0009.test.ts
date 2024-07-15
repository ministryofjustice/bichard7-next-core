import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import TRPR0009 from "./TRPR0009"

describe("TRPR0009", () => {
  it("should not return a trigger if shouldRaiseTrigger is set to false", () => {
    const generateHearingOutcome = generateAhoFromOffenceList([] as Offence[])
    expect(TRPR0009(generateHearingOutcome)).toEqual([])
  })
})
