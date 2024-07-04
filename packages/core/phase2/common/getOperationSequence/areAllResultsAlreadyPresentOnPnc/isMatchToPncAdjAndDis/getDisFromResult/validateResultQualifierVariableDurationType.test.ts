import type { Offence } from "../../../../../../types/AnnotatedHearingOutcome"
import generateAhoFromOffenceList from "../../../../../tests/fixtures/helpers/generateAhoFromOffenceList"
import validateResultQualifierVariableDurationType from "./validateResultQualifierVariableDurationType"

describe("validateResultQualifierVariableDurationType", () => {
  it("should generate exception when DurationType exists", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            ResultQualifierVariable: [
              {
                Code: "1",
                Duration: {
                  DurationType: "Duration1"
                }
              },
              { Code: "2", Duration: {} },
              {
                Code: "3",
                Duration: {
                  DurationType: "Duration2"
                }
              },
              {
                Code: "4",
                Duration: {
                  DurationType: ""
                }
              },
              {
                Code: "5",
                Duration: {
                  DurationType: "Duration3"
                }
              }
            ]
          }
        ]
      } as Offence
    ])

    validateResultQualifierVariableDurationType(aho, 0, 0)

    expect(aho.Exceptions).toStrictEqual([
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
          0,
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
          3,
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
          4,
          "Duration",
          "DurationType"
        ]
      }
    ])
  })

  it("should not generate any exception when ResultQualifierVariable is empty", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            ResultQualifierVariable: []
          }
        ]
      } as unknown as Offence
    ])

    validateResultQualifierVariableDurationType(aho, 0, 0)

    expect(aho.Exceptions).toHaveLength(0)
  })
})
