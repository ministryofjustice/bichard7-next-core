import fs from "fs"
import extractExceptionsFromXml from "./extractExceptionsFromXml"

describe("extractExceptionsFromXml", () => {
  it.each([
    {
      messageType: "AnnotatedHearingOutcome",
      xmlFile: "phase1/tests/fixtures/AnnotatedHO1-with-exceptions.xml",
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
      ]
    },
    {
      messageType: "PncUpdateDataset",
      xmlFile: "phase2/tests/fixtures/PncUpdateDataSet-with-operations-and-exception.xml",
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
      ]
    },
    {
      messageType: "AnnotatedPncUpdateDataset",
      xmlFile: "phase2/tests/fixtures/AnnotatedPncUpdateDataset.xml",
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
      ]
    }
  ])("should extract exceptions from $messageType XML", ({ xmlFile, expected }) => {
    const inputXml = fs.readFileSync(xmlFile).toString()
    const actualExceptions = extractExceptionsFromXml(inputXml)

    expect(actualExceptions).toEqual(expected)
  })
})
