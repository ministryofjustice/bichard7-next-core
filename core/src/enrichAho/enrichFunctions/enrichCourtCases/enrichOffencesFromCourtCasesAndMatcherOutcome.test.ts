import matchCases from "../../../enrichAho/enrichFunctions/enrichCourtCases/caseMatcher/caseMatcher"
import matchMultipleCases from "../../../enrichAho/enrichFunctions/enrichCourtCases/matchMultipleCases"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import createPNCMessage from "../../../../tests/helpers/createPncMessage"
import { createHOOffence, createPNCCourtCaseOffence } from "../../../../tests/helpers/generateMockOffences"
import createPNCCourtCase from "../../../../tests/helpers/generateMockPncCase"
import enrichOffencesFromCourtCasesAndMatcherOutcome from "./enrichOffencesFromCourtCasesAndMatcherOutcome"

describe("enrichOffencesFromCourtCasesAndMatcherOutcome", () => {
  it("should enrichTwoCasesOneOffenceMatchesOneInEach", () => {
    const hoOffences = [
      createHOOffence({
        actOrSource: "CD",
        year: "71",
        reason: "015",
        startDate: "2009-06-01",
        sequenceNumber: 1
      }),
      createHOOffence({
        actOrSource: "TH",
        year: "68",
        reason: "072",
        startDate: "2009-06-01",
        sequenceNumber: 1
      })
    ]

    const pncOffences1 = [
      createPNCCourtCaseOffence({ offenceCode: "CD71015", startDate: "01062009", sequenceNumber: 1 }),
      createPNCCourtCaseOffence({ offenceCode: "CD71015", startDate: "01062009", sequenceNumber: 2 })
    ]
    const pncOffences2 = [
      createPNCCourtCaseOffence({ offenceCode: "TH68072", startDate: "01062009", sequenceNumber: 1 }),
      createPNCCourtCaseOffence({ offenceCode: "TH68072", startDate: "01062009", sequenceNumber: 2 })
    ]

    const case1 = createPNCCourtCase("09/0418/000447K", pncOffences1)
    const case2 = createPNCCourtCase("09/0428/000448U", pncOffences2)

    const pncMessage = createPNCMessage([case1, case2])

    const caseOutcome = matchCases(hoOffences, pncMessage)
    const multipleOutcome = matchMultipleCases(hoOffences, caseOutcome)

    const aho = {
      AnnotatedHearingOutcome: { HearingOutcome: { Case: { HearingDefendant: { Offence: hoOffences } } } }
    } as AnnotatedHearingOutcome
    enrichOffencesFromCourtCasesAndMatcherOutcome(aho, [case1, case2], multipleOutcome)
    const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
    expect(offences[0].CourtCaseReferenceNumber).toBe("09/0418/000447K")
    expect(offences[1].CourtCaseReferenceNumber).toBe("09/0428/000448U")
    expect(aho.Exceptions).toBeUndefined()
  })
})
