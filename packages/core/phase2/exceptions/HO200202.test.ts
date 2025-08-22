import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import HO200202 from "./HO200202"

const offence = {
  CriminalProsecutionReference: {
    OffenceReasonSequence: "1"
  },
  Result: [{ PNCDisposalType: 1001 }]
} as any as Offence

describe("HO200202", () => {
  it("should return exceptions when there are more than 4 result qualifier variables", () => {
    const aho = generateAhoFromOffenceList([offence])
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].ResultQualifierVariable = [
      { Code: "1" },
      { Code: "2" },
      { Code: "3" },
      { Code: "4" },
      { Code: "5" }
    ]

    const exceptions = HO200202(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200202",
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
          0,
          "Code"
        ]
      },
      {
        code: "HO200202",
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
          "Code"
        ]
      },
      {
        code: "HO200202",
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
          "Code"
        ]
      },
      {
        code: "HO200202",
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
          3,
          "Code"
        ]
      },
      {
        code: "HO200202",
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
          4,
          "Code"
        ]
      }
    ])
  })

  it("should not return exceptions when there are 4 result qualifier variables", () => {
    const aho = generateAhoFromOffenceList([offence])
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].ResultQualifierVariable = [
      { Code: "1" },
      { Code: "2" },
      { Code: "3" },
      { Code: "4" }
    ]

    const exceptions = HO200202(aho)

    expect(exceptions).toHaveLength(0)
  })

  it("should not return exceptions when there are no result qualifier variables", () => {
    const aho = generateAhoFromOffenceList([offence])
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].ResultQualifierVariable = []

    const exceptions = HO200202(aho)

    expect(exceptions).toHaveLength(0)
  })
})
