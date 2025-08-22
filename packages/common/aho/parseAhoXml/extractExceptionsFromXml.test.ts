import fs from "fs"
import path from "path"

import extractExceptionsFromXml from "./extractExceptionsFromXml"

describe("extractExceptionsFromXml", () => {
  it.each([
    {
      expected: [
        {
          code: "HO100324",
          path: [
            "AnnotatedHearingOutcome",
            "HearingOutcome",
            "Case",
            "HearingDefendant",
            "Offence",
            1,
            "Result",
            0,
            "ResultClass"
          ]
        },
        {
          code: "HO100301",
          message: "I0001 - Error message 1",
          path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
        },
        {
          code: "HO100301",
          message: "I0001 - Error message 2",
          path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
        }
      ],
      messageType: "AnnotatedHearingOutcome",
      xmlFile: "AnnotatedHO1-with-pnc-errors.xml"
    },
    {
      expected: [
        {
          code: "HO100301",
          path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
        },
        {
          code: "HO100324",
          path: [
            "AnnotatedHearingOutcome",
            "HearingOutcome",
            "Case",
            "HearingDefendant",
            "Offence",
            1,
            "Result",
            0,
            "ResultClass"
          ]
        }
      ],
      messageType: "AnnotatedHearingOutcome",
      xmlFile: "AnnotatedHO1-with-exceptions.xml"
    },
    {
      expected: [
        {
          code: "HO200101",
          path: [
            "PNCUpdateDataset",
            "AnnotatedHearingOutcome",
            "HearingOutcome",
            "Case",
            "HearingDefendant",
            "Offence",
            0,
            "Result",
            0,
            "ResultClass"
          ]
        }
      ],
      messageType: "PncUpdateDataset",
      xmlFile: "PncUpdateDataSet-with-operations-and-exception.xml"
    },
    {
      expected: [
        {
          code: "HO200124",
          path: [
            "AnnotatedPNCUpdateDataset",
            "PNCUpdateDataset",
            "AnnotatedHearingOutcome",
            "HearingOutcome",
            "Case",
            "HearingDefendant",
            "Offence",
            0,
            "Result",
            0,
            "ResultClass"
          ]
        }
      ],
      messageType: "AnnotatedPncUpdateDataset",
      xmlFile: "AnnotatedPncUpdateDataset.xml"
    }
  ])("should extract exceptions from $messageType XML", ({ expected, xmlFile }) => {
    const inputXml = fs.readFileSync(path.resolve(__dirname, "fixtures", xmlFile)).toString()
    const actualExceptions = extractExceptionsFromXml(inputXml)

    expect(actualExceptions).toEqual(expected)
  })
})
