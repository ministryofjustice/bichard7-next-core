import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import TRPR0009 from "./TRPR0009"

const generateHearingOutcome = generateAhoFromOffenceList([] as Offence[])

describe("TRPR0009", () => {
  it("should not return trigger is shouldRaiseTrigger is false", () => {
    expect(TRPR0009(generateHearingOutcome)).toEqual([])
  })
})
