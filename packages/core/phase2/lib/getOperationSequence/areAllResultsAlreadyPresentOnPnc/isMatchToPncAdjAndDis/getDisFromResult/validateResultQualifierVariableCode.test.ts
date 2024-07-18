import type { Offence } from "../../../../../../types/AnnotatedHearingOutcome"
import generateAhoFromOffenceList from "../../../../../tests/fixtures/helpers/generateAhoFromOffenceList"
import validateResultQualifierVariableCode from "./validateResultQualifierVariableCode"

describe("validateResultQualifierVariableCode", () => {
  it("should not generate exception HO200202 when there are less than 4 qualifier variables", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            ResultQualifierVariable: [{ Code: "1" }, { Code: "2" }, { Code: "3" }]
          }
        ]
      } as Offence
    ])

    const result = validateResultQualifierVariableCode(aho, 0, 0)

    expect(result).toHaveLength(0)
  })

  it("should not generate exception HO200202 when there are 4 qualifier variables", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            ResultQualifierVariable: [{ Code: "1" }, { Code: "2" }, { Code: "3" }, { Code: "4" }]
          }
        ]
      } as Offence
    ])

    const result = validateResultQualifierVariableCode(aho, 0, 0)

    expect(result).toHaveLength(0)
  })

  it("should generate exception HO200202 on all result's ResultQualifierVariable.Code when there are more than 4 qualifier variables", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            ResultQualifierVariable: [{ Code: "1" }, { Code: "2" }, { Code: "3" }, { Code: "4" }, { Code: "5" }]
          }
        ]
      } as Offence
    ])

    const result = validateResultQualifierVariableCode(aho, 0, 0)

    expect(result).toStrictEqual([
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
})
