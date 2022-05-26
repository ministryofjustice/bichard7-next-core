import createPNCMessage from "tests/helpers/createPncMessage"
import { createHOOffence, createPNCCourtCaseOffence } from "tests/helpers/generateMockOffences"
import createPNCCourtCase from "tests/helpers/generateMockPncCase"
import matchCases from "./caseMatcher"

describe("caseMatcher", () => {
  it("should testMatchNoActualMatchesNoNonMatchingExplicitMatchesNoCCRWithAllFinalResults", () => {
    const hoOffences = [
      createHOOffence({
        startDate: "2006-03-03"
      })
    ]

    const pncOffences = [
      createPNCCourtCaseOffence({ offenceCode: "XX13451", startDate: "03032006", sequenceNumber: 1 })
    ]

    const pncCases = [createPNCCourtCase("09/11FG/568235X", pncOffences)]
    const pncMessage = createPNCMessage(pncCases)

    const outcome = matchCases(hoOffences, pncMessage)

    expect(outcome.courtCaseMatches).toHaveLength(0)
    expect(outcome.penaltyCaseMatches).toHaveLength(0)
  })

  it("should testMatchActualMatchesNoNonMatchingExplicitMatchesNoCCRWithAllFinalResults", () => {
    const hoOffences = [createHOOffence({ startDate: "2006-03-03" })]
    const pncOffences = [createPNCCourtCaseOffence({ startDate: "03032006", sequenceNumber: 1 })]
    const pncCase = createPNCCourtCase("09/11FG/568235X", pncOffences)
    const pncMessage = createPNCMessage([pncCase])
    const outcome = matchCases(hoOffences, pncMessage)
    expect(outcome.courtCaseMatches).toHaveLength(1)
    expect(outcome.courtCaseMatches[0].courtCase).toEqual(pncCase)
    expect(outcome.penaltyCaseMatches).toHaveLength(0)
  })

  it("should testMatchNoActualMatchesNonMatchingExplicitMatchesNoCCRWithAllFinalResults", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2006-03-03" }),
      createHOOffence({ reason: "031", startDate: "2006-03-03", sequenceNumber: 1 })
    ]
    const pncOffence = createPNCCourtCaseOffence({ offenceCode: "XX13451", startDate: "03032006", sequenceNumber: 1 })
    const pncCase = createPNCCourtCase("09/11FG/568235X", [pncOffence])
    const pncMessage = createPNCMessage([pncCase])
    const outcome = matchCases(hoOffences, pncMessage)

    expect(outcome.courtCaseMatches).toHaveLength(0)
    expect(outcome.penaltyCaseMatches).toHaveLength(0)
  })

  it("should testMatchActualMatchesNonMatchingExplicitMatchesNoCCRWithAllFinalResults", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2006-03-03" }),
      createHOOffence({ reason: "031", startDate: "2006-03-03", sequenceNumber: 2 })
    ]
    const pncOffences1 = [createPNCCourtCaseOffence({ startDate: "03032006", sequenceNumber: 1 })]
    const pncOffences2 = [createPNCCourtCaseOffence({ startDate: "03032006", sequenceNumber: 2 })]
    const pncCases = [
      createPNCCourtCase("09/11FG/568235X", pncOffences1),
      createPNCCourtCase("09/11FG/568236X", pncOffences2)
    ]
    const pncMessage = createPNCMessage(pncCases)
    const outcome = matchCases(hoOffences, pncMessage)

    expect(outcome.courtCaseMatches).toHaveLength(2)
    expect(outcome.courtCaseMatches[0].courtCase).toStrictEqual(pncCases[0])
    expect(outcome.penaltyCaseMatches).toHaveLength(0)
  })

  it("should testMatchNoActualMatchesNoNonMatchingExplicitMatchesCCRWithAllFinalResults", () => {
    const hoOffences = [createHOOffence({ startDate: "2006-03-03" })]
    const pncOffences = [
      createPNCCourtCaseOffence({
        offenceCode: "XX13451",
        startDate: "03032006",
        sequenceNumber: 1,
        disposalCodes: [1115]
      })
    ]
    const pncCases = [createPNCCourtCase("09/11FG/568235X", pncOffences)]
    const pncMessage = createPNCMessage(pncCases)
    const outcome = matchCases(hoOffences, pncMessage)

    expect(outcome.courtCaseMatches).toHaveLength(0)
    expect(outcome.penaltyCaseMatches).toHaveLength(0)
  })

  it("should testMatchActualMatchesNoNonMatchingExplicitMatchesCCRWithAllFinalResults", () => {
    const hoOffences = [createHOOffence({ startDate: "2006-03-03" })]
    const pncOffences1 = [createPNCCourtCaseOffence({ startDate: "03032006", sequenceNumber: 1 })]
    const pncOffences2 = [
      createPNCCourtCaseOffence({
        offenceCode: "XX13451",
        startDate: "03032006",
        sequenceNumber: 2,
        disposalCodes: [1115]
      })
    ]
    const pncCases = [
      createPNCCourtCase("09/11FG/568235X", pncOffences1),
      createPNCCourtCase("09/11FG/568236X", pncOffences2)
    ]
    const pncMessage = createPNCMessage(pncCases)
    const outcome = matchCases(hoOffences, pncMessage)
    expect(outcome.courtCaseMatches).toHaveLength(1)
    expect(outcome.courtCaseMatches[0].courtCase).toEqual(pncCases[0])
    expect(outcome.penaltyCaseMatches).toHaveLength(0)
  })

  it("should testMatchNoActualMatchesNonMatchingExplicitMatchesCCRWithAllFinalResults", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2006-03-03" }),
      createHOOffence({ reason: "031", startDate: "2006-03-03", sequenceNumber: 1 })
    ]
    const pncOffences1 = [
      createPNCCourtCaseOffence({ offenceCode: "XX13451", startDate: "03032006", sequenceNumber: 1 })
    ]
    const pncOffences2 = [
      createPNCCourtCaseOffence({
        offenceCode: "XX13451",
        startDate: "03032006",
        sequenceNumber: 2,
        disposalCodes: [1115]
      })
    ]
    const pncCases = [
      createPNCCourtCase("09/11FG/568235X", pncOffences1),
      createPNCCourtCase("09/11FG/568236X", pncOffences2)
    ]
    const pncMessage = createPNCMessage(pncCases)
    const outcome = matchCases(hoOffences, pncMessage)

    expect(outcome.courtCaseMatches).toHaveLength(0)
    expect(outcome.penaltyCaseMatches).toHaveLength(0)
  })

  it("should testMatchActualMatchesNonMatchingExplicitMatchesCCRWithAllFinalResults", () => {
    const hoOffences = [
      createHOOffence({ startDate: "2006-03-03" }),
      createHOOffence({ reason: "031", startDate: "2006-03-03", sequenceNumber: 2 })
    ]
    const pncOffences1 = [createPNCCourtCaseOffence({ startDate: "03032006", sequenceNumber: 1 })]
    const pncOffences2 = [createPNCCourtCaseOffence({ startDate: "03032006", sequenceNumber: 2 })]
    const pncOffences3 = [
      createPNCCourtCaseOffence({
        offenceCode: "XX13451",
        startDate: "03032006",
        sequenceNumber: 3,
        disposalCodes: [1115]
      })
    ]
    const pncCases = [
      createPNCCourtCase("09/11FG/568235X", pncOffences1),
      createPNCCourtCase("09/11FG/568236X", pncOffences2),
      createPNCCourtCase("09/11FG/568237X", pncOffences3)
    ]
    const pncMessage = createPNCMessage(pncCases)
    const outcome = matchCases(hoOffences, pncMessage)

    expect(outcome.courtCaseMatches).toHaveLength(2)
    expect(outcome.courtCaseMatches[0].courtCase).toEqual(pncCases[0])
    expect(outcome.courtCaseMatches[1].courtCase).toEqual(pncCases[1])
    expect(outcome.penaltyCaseMatches).toHaveLength(0)
  })

  it("should testExplicitMatchTwoCasesOneMatches() throws Exception", () => {
    const hoOffences = [createHOOffence({ startDate: "2010-01-01", sequenceNumber: 1 })]
    const pncOffencesCase1 = [createPNCCourtCaseOffence({ startDate: "01012010", sequenceNumber: 1 })]
    const pncOffencesCase2 = [
      createPNCCourtCaseOffence({ offenceCode: "VG24031", startDate: "01012010", sequenceNumber: 1 })
    ]
    const pncCases = [
      createPNCCourtCase("09/11FG/568236X", pncOffencesCase1),
      createPNCCourtCase("09/11FG/568237X", pncOffencesCase2)
    ]

    const outcome = matchCases(hoOffences, createPNCMessage(pncCases))
    expect(outcome.courtCaseMatches).toHaveLength(1)
    expect(outcome.courtCaseMatches[0].courtCase).toEqual(pncCases[0])
  })

  it("should testExplicitMatchTwoCasesBothMatch() throws Exception", () => {
    const hoOffences = [createHOOffence({ startDate: "2010-01-01", sequenceNumber: 1 })]
    const pncOffencesCase1 = [createPNCCourtCaseOffence({ startDate: "01012010", sequenceNumber: 1 })]
    const pncOffencesCase2 = [createPNCCourtCaseOffence({ startDate: "01012010", sequenceNumber: 1 })]
    const pncCases = [
      createPNCCourtCase("09/11FG/568236X", pncOffencesCase1),
      createPNCCourtCase("09/11FG/568237X", pncOffencesCase2)
    ]

    const outcome = matchCases(hoOffences, createPNCMessage(pncCases))
    expect(outcome.courtCaseMatches).toHaveLength(2)
    expect(outcome.courtCaseMatches[0].courtCase).toEqual(pncCases[0])
    expect(outcome.courtCaseMatches[1].courtCase).toEqual(pncCases[1])
  })

  it("should testExplicitMatchTwoCasesNeitherMatchesNoOtherMatches() throws Exception", () => {
    const hoOffences = [createHOOffence({ startDate: "2010-01-01", sequenceNumber: 1 })]
    const pncOffencesCase1 = [
      createPNCCourtCaseOffence({ offenceCode: "VG24031", startDate: "01012010", sequenceNumber: 1 })
    ]
    const pncOffencesCase2 = [
      createPNCCourtCaseOffence({ offenceCode: "VG24031", startDate: "01012010", sequenceNumber: 1 })
    ]
    const cases = [
      createPNCCourtCase("09/11FG/568236X", pncOffencesCase1),
      createPNCCourtCase("09/11FG/568237X", pncOffencesCase2)
    ]

    const outcome = matchCases(hoOffences, createPNCMessage(cases))

    expect(outcome.courtCaseMatches).toHaveLength(0)
    expect(outcome.penaltyCaseMatches).toHaveLength(0)
  })

  it("should testExplicitMatchTwoCasesOneOffenceMatchesOneInEach() throws Exception", () => {
    const hoOffences = [
      createHOOffence({
        actOrSource: "CD",
        year: "71",
        reason: "015",
        startDate: "2009-06-01",
        sequenceNumber: 1,
        courtCaseReferenceNumber: "09/0418/000447K"
      }),
      createHOOffence({
        actOrSource: "TH",
        year: "68",
        reason: "072",
        startDate: "2009-06-01",
        sequenceNumber: 1,
        courtCaseReferenceNumber: "09/0418/000448U"
      })
    ]
    const pncOffencesCase1 = [
      createPNCCourtCaseOffence({ offenceCode: "CD71015", startDate: "01062009", sequenceNumber: 1 }),
      createPNCCourtCaseOffence({ offenceCode: "CD71015", startDate: "01062009", sequenceNumber: 2 })
    ]
    const pncOffencesCase2 = [
      createPNCCourtCaseOffence({ offenceCode: "TH68072", startDate: "01062009", sequenceNumber: 1 }),
      createPNCCourtCaseOffence({ offenceCode: "TH68072", startDate: "01062009", sequenceNumber: 2 })
    ]
    const pncCases = [
      createPNCCourtCase("09/0418/000447K", pncOffencesCase1),
      createPNCCourtCase("09/0418/000448U", pncOffencesCase2)
    ]

    const outcome = matchCases(hoOffences, createPNCMessage(pncCases))
    expect(outcome.courtCaseMatches).toHaveLength(2)
    expect(outcome.courtCaseMatches[0].courtCase).toEqual(pncCases[0])
    expect(outcome.courtCaseMatches[1].courtCase).toEqual(pncCases[1])
  })
})
