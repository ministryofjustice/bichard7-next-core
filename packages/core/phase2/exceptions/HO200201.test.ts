import generateAhoMatchingPncAdjudicationAndDisposals from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import HO200201 from "./HO200201"

describe("HO200201", () => {
  it("should return exceptions for duration types in result qualifier variables that have value", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].ResultQualifierVariable = [
      {
        Code: "1"
      },
      {
        Code: "2",
        Duration: {
          DurationLength: 1,
          DurationType: "dummy1",
          DurationUnit: "dummy2"
        }
      },
      {
        Code: "3",
        Duration: {
          DurationLength: 1,
          DurationType: "dummy3",
          DurationUnit: "dummy4"
        }
      },
      {
        Code: "4"
      }
    ]

    const exceptions = HO200201(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200201",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "ResultQualifierVariable",
          1,
          "Duration",
          "DurationType"
        ]
      },
      {
        code: "HO200201",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "ResultQualifierVariable",
          2,
          "Duration",
          "DurationType"
        ]
      }
    ])
  })

  it("should not return exception when duration types in result qualifier variables are undefined", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].ResultQualifierVariable = [
      {
        Code: "1",
        Duration: undefined
      },
      {
        Code: "2",
        Duration: undefined
      },
      {
        Code: "3",
        Duration: undefined
      }
    ]

    const exceptions = HO200201(aho)

    expect(exceptions).toHaveLength(0)
  })

  it("should not return exception when there are no result qualifier variables in result", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].ResultQualifierVariable = []

    const exceptions = HO200201(aho)

    expect(exceptions).toHaveLength(0)
  })
})
