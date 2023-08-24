import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import generateMockAho from "../../../tests/helpers/generateMockAho"
import enrichOffenceResults from "./enrichOffenceResults"

describe("EnrichOffenceResults", () => {
  let aho: AnnotatedHearingOutcome

  beforeEach(() => {
    aho = generateMockAho({
      offences: [{ results: [{ code: 2511 }, { code: 2091 }] }, { results: [{ code: 3052 }] }]
    })
  })

  it("should populate the offence result half life hours correctly", () => {
    const result = enrichOffenceResults(aho)
    const offences = result.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

    expect(offences).toHaveLength(2)
    expect(offences[0].Result).toHaveLength(2)
    expect(offences[0].Result[0].ResultHalfLifeHours).toBe(72)
    expect(offences[0].Result[1].ResultHalfLifeHours).toBeUndefined()
    expect(offences[1].Result[0].ResultHalfLifeHours).toBe(24)
  })

  it("should populate the offence result urgency correctly", () => {
    const result = enrichOffenceResults(aho)
    const offences = result.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

    expect(offences).toHaveLength(2)
    expect(offences[0].Result).toHaveLength(2)
    expect(offences[0].Result[0].Urgent).toBeUndefined()
    expect(offences[0].Result[1].Urgent).toBeUndefined()
    expect(offences[1].Result[0].Urgent).toStrictEqual({ urgent: true, urgency: 24 })
  })
})
