import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import HO200203 from "./HO200203"

describe("HO200203", () => {
  it("should return exceptions when there are more than 20 bail condition lines for the PNC", () => {
    const aho = generateAhoFromOffenceList([])
    const string200 = "Xxxx xxxx ".repeat(20)
    const extraLongString300 = "Xxxx xxxx ".repeat(30)
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.BailConditions = [
      string200,
      string200,
      string200,
      string200,
      string200,
      string200,
      string200,
      string200,
      string200,
      extraLongString300,
      string200,
      string200,
      string200,
      string200,
      extraLongString300,
      string200,
      string200,
      string200,
      string200,
      string200
    ]

    const exceptions = HO200203(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200203",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "BailConditions",
          18
        ]
      },
      {
        code: "HO200203",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "BailConditions",
          19
        ]
      }
    ])
  })

  it("should not return exceptions when there are 20 bail condition lines for the PNC", () => {
    const aho = generateAhoFromOffenceList([])
    const string200 = "Xxxx xxxx ".repeat(20)
    const extraLongString300 = "Xxxx xxxx ".repeat(30)
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.BailConditions = [
      string200,
      string200,
      string200,
      string200,
      string200,
      string200,
      string200,
      string200,
      string200,
      extraLongString300,
      string200,
      string200,
      string200,
      string200,
      extraLongString300,
      string200,
      string200,
      string200,
    ]

    const exceptions = HO200203(aho)

    expect(exceptions).toHaveLength(0)
  })
})
